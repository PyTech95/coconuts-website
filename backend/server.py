from fastapi import FastAPI, APIRouter, Request, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse, Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
import requests
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Object storage (Emergent) — used for customer logo/image uploads
# ---------------------------------------------------------------------------
STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY")
APP_NAME = "coconut"
MIME_TYPES = {"jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png", "gif": "image/gif", "webp": "image/webp"}
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}
MAX_LOGO_BYTES = 5 * 1024 * 1024  # 5 MB
_storage_key = None


def init_storage(force: bool = False):
    global _storage_key
    if _storage_key and not force:
        return _storage_key
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
    resp.raise_for_status()
    _storage_key = resp.json()["storage_key"]
    return _storage_key


def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    resp = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data, timeout=120,
    )
    if resp.status_code == 404:
        key = init_storage(force=True)
        resp = requests.put(
            f"{STORAGE_URL}/objects/{path}",
            headers={"X-Storage-Key": key, "Content-Type": content_type},
            data=data, timeout=120,
        )
    resp.raise_for_status()
    return resp.json()


def get_object(path: str):
    key = init_storage()
    resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=60)
    if resp.status_code == 404:
        key = init_storage(force=True)
        resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=60)
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")

# MongoDB connection
# MONGO_URL=mock:// runs an in-memory database (local development / tests without MongoDB).
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
if mongo_url.startswith("mock://"):
    from mongomock_motor import AsyncMongoMockClient  # dev-only dependency (requirements-dev.txt)
    client = AsyncMongoMockClient()
    logger.warning("Using in-memory mock MongoDB (MONGO_URL=mock://) — data is lost on restart")
else:
    client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'mr_coconetto')]

# ---------------------------------------------------------------------------
# Media uploads for the website editor (images + short videos).
# Stored in Emergent object storage when EMERGENT_LLM_KEY is configured,
# otherwise on local disk under UPLOAD_DIR and served from /api/uploads/.
# ---------------------------------------------------------------------------
UPLOAD_DIR = Path(os.environ.get("UPLOAD_DIR") or (ROOT_DIR / "uploads"))
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
MAX_IMAGE_BYTES = 15 * 1024 * 1024   # 15 MB
MAX_VIDEO_BYTES = 60 * 1024 * 1024   # 60 MB
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/webm", "video/quicktime"}
MAX_CONTENT_BYTES = 6 * 1024 * 1024  # site content JSON (incl. any inline data URLs)
CONTENT_REVISIONS_KEEP = 30

# ---------------------------------------------------------------------------
# Auth (JWT, single admin) + Email alerts (Resend)
# ---------------------------------------------------------------------------
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_DAYS = 7
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@example.com").lower()
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")
RESEND_API_KEY = (os.environ.get("RESEND_API_KEY") or "").strip()
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
ALERT_RECIPIENTS = [e.strip() for e in os.environ.get("ALERT_RECIPIENTS", "").split(",") if e.strip()]


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": "admin",
        "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(days=ACCESS_TOKEN_DAYS),
    }
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


async def get_current_admin(request: Request) -> dict:
    auth_header = request.headers.get("Authorization", "")
    token = auth_header[7:] if auth_header.startswith("Bearer ") else None
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired. Please log in again.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"id": payload.get("sub")}, {"_id": 0, "password_hash": 0})
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=401, detail="Not authorized")
    return user


def _alert_html(title: str, rows: list) -> str:
    tr = "".join(
        f'<tr><td style="padding:6px 12px;color:#6b7280;font-size:13px;">{k}</td>'
        f'<td style="padding:6px 12px;color:#111827;font-size:14px;font-weight:600;">{v}</td></tr>'
        for k, v in rows
    )
    return (
        f'<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;">'
        f'<div style="background:linear-gradient(90deg,#16a34a,#db2777);color:#fff;padding:18px 22px;border-radius:12px 12px 0 0;">'
        f'<h2 style="margin:0;font-size:18px;">🥥 {title}</h2></div>'
        f'<table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #eee;border-top:0;border-radius:0 0 12px 12px;">{tr}</table>'
        f'<p style="color:#9ca3af;font-size:12px;margin-top:12px;">Mr. Coconetto — automated notification</p></div>'
    )


def _send_email_sync(subject: str, html: str):
    import resend
    resend.api_key = RESEND_API_KEY
    resend.Emails.send({"from": SENDER_EMAIL, "to": ALERT_RECIPIENTS, "subject": subject, "html": html})


async def send_alert(subject: str, html: str):
    """Fire-and-forget email alert. No-op (logged) if Resend key/recipients not configured."""
    if not RESEND_API_KEY or not ALERT_RECIPIENTS:
        logger.info("Email alert skipped (Resend not configured): %s", subject)
        return
    try:
        await asyncio.to_thread(_send_email_sync, subject, html)
        logger.info("Email alert sent: %s -> %s", subject, ALERT_RECIPIENTS)
    except Exception as exc:
        logger.error("Email alert failed (%s): %s", subject, exc)

# Create the main app without a prefix
app = FastAPI(title="Mr. Coconetto API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class Enquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    whatsapp: str
    eventType: str = ""
    eventDate: str = ""
    location: str = ""
    quantity: str = ""
    customization: str = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class EnquiryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    whatsapp: str = Field(..., min_length=3, max_length=30)
    eventType: str = Field("", max_length=60)
    eventDate: str = Field("", max_length=40)
    location: str = Field("", max_length=120)
    quantity: str = Field("", max_length=60)
    customization: str = Field("", max_length=1000)

def _make_order_number() -> str:
    return f"MC-{uuid.uuid4().hex[:6].upper()}"

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order_number: str = Field(default_factory=_make_order_number)
    print_text: str
    event_name: str
    mobile: str
    logo_url: str = ""
    logo_path: str = ""
    status: str = "new"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OrderCreate(BaseModel):
    print_text: str = Field("", max_length=60)
    event_name: str = Field(..., min_length=1, max_length=120)
    mobile: str = Field(..., min_length=5, max_length=20)
    logo_url: str = Field("", max_length=500)
    logo_path: str = Field("", max_length=500)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1, max_length=200)

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.get("/health")
async def health():
    """Uptime/health probe. Verifies the DB connection is reachable."""
    try:
        await client.admin.command("ping")
        db_ok = True
    except Exception as exc:
        logger.error("Health check DB ping failed: %s", exc)
        db_ok = False
    status = "ok" if db_ok else "degraded"
    payload = {"status": status, "database": "up" if db_ok else "down"}
    return JSONResponse(status_code=200 if db_ok else 503, content=payload)

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)

    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()

    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).sort("timestamp", -1).limit(100).to_list(100)

    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])

    return status_checks

@api_router.post("/enquiries", response_model=Enquiry)
async def create_enquiry(input: EnquiryCreate):
    """Store a customer enquiry (lead) from the contact form."""
    enquiry = Enquiry(**input.model_dump())
    doc = enquiry.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.enquiries.insert_one(doc)
    logger.info("New enquiry from %s (%s)", enquiry.name, enquiry.whatsapp)
    asyncio.create_task(send_alert(
        f"New Enquiry — {enquiry.name}",
        _alert_html("New Enquiry", [
            ("Name", enquiry.name), ("WhatsApp", enquiry.whatsapp),
            ("Event", enquiry.eventType or "—"), ("Date", enquiry.eventDate or "—"),
            ("Location", enquiry.location or "—"), ("Quantity", enquiry.quantity or "—"),
            ("Notes", enquiry.customization or "—"),
        ]),
    ))
    return enquiry

@api_router.post("/orders", response_model=Order)
async def create_order(input: OrderCreate):
    """Create a personalized-coconut order and return an instant order number."""
    if not input.print_text.strip() and not input.logo_url.strip():
        raise HTTPException(status_code=400, detail="Please add print text or a logo for your coconut.")
    order = Order(**input.model_dump())
    doc = order.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.orders.insert_one(doc)
    logger.info("New order %s: '%s' / %s (%s)", order.order_number, order.print_text, order.event_name, order.mobile)
    rows = [
        ("Order No", order.order_number), ("Print Text", order.print_text.replace("\n", " / ")),
        ("Event", order.event_name), ("Mobile", order.mobile),
    ]
    if order.logo_url:
        rows.append(("Logo", f'<a href="{order.logo_url}">View logo</a>'))
    asyncio.create_task(send_alert(f"New Order {order.order_number}", _alert_html("New Order", rows)))
    return order


@api_router.post("/auth/login")
async def login(payload: LoginRequest):
    """Admin login. Returns a Bearer access token."""
    email = payload.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user["id"], email)
    return {"access_token": token, "user": {"email": email, "name": user.get("name", "Admin"), "role": user.get("role", "admin")}}


@api_router.get("/auth/me")
async def auth_me(admin: dict = Depends(get_current_admin)):
    return {"email": admin["email"], "name": admin.get("name", "Admin"), "role": admin.get("role", "admin")}


@api_router.get("/admin/orders")
async def admin_orders(admin: dict = Depends(get_current_admin)):
    docs = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).limit(500).to_list(500)
    return docs


@api_router.get("/admin/enquiries")
async def admin_enquiries(admin: dict = Depends(get_current_admin)):
    docs = await db.enquiries.find({}, {"_id": 0}).sort("created_at", -1).limit(500).to_list(500)
    return docs


class StatusUpdate(BaseModel):
    status: str = Field(..., max_length=40)


@api_router.patch("/admin/orders/{oid}")
async def update_order_status(oid: str, payload: StatusUpdate, admin: dict = Depends(get_current_admin)):
    res = await db.orders.update_one({"id": oid}, {"$set": {"status": payload.status}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"ok": True, "status": payload.status}


@api_router.delete("/admin/orders/{oid}")
async def delete_order(oid: str, admin: dict = Depends(get_current_admin)):
    await db.orders.delete_one({"id": oid})
    return {"ok": True}


@api_router.delete("/admin/enquiries/{eid}")
async def delete_enquiry(eid: str, admin: dict = Depends(get_current_admin)):
    await db.enquiries.delete_one({"id": eid})
    return {"ok": True}

@api_router.post("/upload-logo")
async def upload_logo(file: UploadFile = File(...)):
    """Upload a customer logo/image for engraving. Returns a served URL + storage path."""
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Only PNG, JPG, GIF or WEBP images are allowed.")
    data = await file.read()
    if len(data) > MAX_LOGO_BYTES:
        raise HTTPException(status_code=400, detail="Image is too large (max 5 MB).")
    if not data:
        raise HTTPException(status_code=400, detail="Empty file.")
    ext = (file.filename.rsplit(".", 1)[-1].lower() if file.filename and "." in file.filename else "png")
    logo_id = str(uuid.uuid4())
    path = f"{APP_NAME}/logos/{logo_id}.{ext}"
    stored_path, url = "", ""
    if EMERGENT_KEY:
        try:
            result = put_object(path, data, file.content_type or MIME_TYPES.get(ext, "application/octet-stream"))
            stored_path = result["path"]
            url = f"/api/files/{stored_path}"
        except Exception as exc:
            logger.warning("Logo upload to object storage failed, using local disk: %s", exc)
    if not url:
        # Local-disk fallback (no object storage configured)
        fname = f"logo-{logo_id}.{ext}"
        (UPLOAD_DIR / fname).write_bytes(data)
        stored_path = fname
        url = f"/api/uploads/{fname}"
    await db.logos.insert_one({
        "id": logo_id,
        "storage_path": stored_path,
        "original_filename": file.filename,
        "content_type": file.content_type,
        "size": len(data),
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"path": stored_path, "url": url}


@api_router.get("/files/{path:path}")
async def serve_file(path: str):
    """Public serve of an uploaded logo/image by its storage path."""
    record = await db.logos.find_one({"storage_path": path, "is_deleted": False})
    if not record:
        record = await db.media.find_one({"storage_path": path, "is_deleted": False})
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    try:
        data, content_type = get_object(path)
    except Exception as exc:
        logger.exception("File serve failed for %s: %s", path, exc)
        raise HTTPException(status_code=502, detail="Could not load the image.")
    return Response(content=data, media_type=record.get("content_type") or content_type)


# ---------------------------------------------------------------------------
# Website content (CMS). One document holds every text / image / list / colour
# of the site. The frontend merges it over its built-in defaults, so keys that
# were never edited keep their default value.
# ---------------------------------------------------------------------------
class ContentPayload(BaseModel):
    content: dict
    note: str = Field("", max_length=200)


@api_router.get("/content")
async def get_content():
    """Public: current website content (null if nothing has been saved yet)."""
    doc = await db.site_content.find_one({"key": "site"}, {"_id": 0})
    if not doc:
        return {"content": None, "updated_at": None}
    return {"content": doc.get("content"), "updated_at": doc.get("updated_at")}


@api_router.put("/content")
async def put_content(payload: ContentPayload, admin: dict = Depends(get_current_admin)):
    """Admin: replace the website content. Keeps the last few revisions for restore."""
    import json
    raw = json.dumps(payload.content, ensure_ascii=False)
    if len(raw.encode("utf-8")) > MAX_CONTENT_BYTES:
        raise HTTPException(status_code=413, detail="Content is too large. Upload images/videos as files instead of pasting them inline.")
    now = datetime.now(timezone.utc).isoformat()
    previous = await db.site_content.find_one({"key": "site"}, {"_id": 0})
    if previous and previous.get("content") is not None:
        await db.content_revisions.insert_one({
            "id": str(uuid.uuid4()),
            "content": previous["content"],
            "saved_at": previous.get("updated_at"),
            "saved_by": previous.get("updated_by"),
            "created_at": now,
        })
        # keep only the newest N revisions
        old = await db.content_revisions.find({}, {"_id": 0, "id": 1}).sort("created_at", -1).skip(CONTENT_REVISIONS_KEEP).to_list(1000)
        if old:
            await db.content_revisions.delete_many({"id": {"$in": [o["id"] for o in old]}})
    await db.site_content.update_one(
        {"key": "site"},
        {"$set": {"key": "site", "content": payload.content, "updated_at": now, "updated_by": admin.get("email"), "note": payload.note}},
        upsert=True,
    )
    logger.info("Site content saved by %s (%d bytes)", admin.get("email"), len(raw))
    return {"ok": True, "updated_at": now}


@api_router.get("/admin/content/revisions")
async def list_revisions(admin: dict = Depends(get_current_admin)):
    docs = await db.content_revisions.find({}, {"_id": 0, "content": 0}).sort("created_at", -1).to_list(CONTENT_REVISIONS_KEEP)
    return docs


@api_router.post("/admin/content/revisions/{rev_id}/restore")
async def restore_revision(rev_id: str, admin: dict = Depends(get_current_admin)):
    rev = await db.content_revisions.find_one({"id": rev_id}, {"_id": 0})
    if not rev:
        raise HTTPException(status_code=404, detail="Revision not found")
    await put_content(ContentPayload(content=rev["content"], note=f"restored {rev_id[:8]}"), admin)
    return {"ok": True, "content": rev["content"]}


# ---------------------------------------------------------------------------
# Media library (admin uploads: photos + short videos)
# ---------------------------------------------------------------------------
def _media_kind(content_type: str) -> str:
    return "video" if (content_type or "").startswith("video/") else "image"


@api_router.post("/admin/upload")
async def admin_upload(file: UploadFile = File(...), admin: dict = Depends(get_current_admin)):
    """Upload an image or a short video for use anywhere on the website."""
    ctype = (file.content_type or "").lower()
    if ctype not in ALLOWED_IMAGE_TYPES and ctype not in ALLOWED_VIDEO_TYPES:
        raise HTTPException(status_code=400, detail="Only JPG, PNG, GIF, WEBP images or MP4/WebM/MOV videos are allowed.")
    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="Empty file.")
    kind = _media_kind(ctype)
    limit = MAX_VIDEO_BYTES if kind == "video" else MAX_IMAGE_BYTES
    if len(data) > limit:
        raise HTTPException(status_code=400, detail=f"File is too large (max {limit // (1024 * 1024)} MB for {kind}s).")
    ext = (file.filename.rsplit(".", 1)[-1].lower() if file.filename and "." in file.filename else ("mp4" if kind == "video" else "jpg"))
    ext = "".join(ch for ch in ext if ch.isalnum())[:5] or "bin"
    media_id = str(uuid.uuid4())
    stored_path = ""
    url = ""
    storage = "local"
    if EMERGENT_KEY:
        try:
            result = put_object(f"{APP_NAME}/media/{media_id}.{ext}", data, ctype)
            stored_path = result["path"]
            url = f"/api/files/{stored_path}"
            storage = "object"
        except Exception as exc:
            logger.warning("Object storage upload failed, falling back to local disk: %s", exc)
    if not url:
        fname = f"{media_id}.{ext}"
        (UPLOAD_DIR / fname).write_bytes(data)
        stored_path = fname
        url = f"/api/uploads/{fname}"
    doc = {
        "id": media_id,
        "name": file.filename or f"{media_id}.{ext}",
        "type": kind,
        "content_type": ctype,
        "size": len(data),
        "storage": storage,
        "storage_path": stored_path,
        "url": url,
        "is_deleted": False,
        "uploaded_by": admin.get("email"),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.media.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.get("/admin/media")
async def admin_media(admin: dict = Depends(get_current_admin)):
    docs = await db.media.find({"is_deleted": False}, {"_id": 0}).sort("created_at", -1).limit(500).to_list(500)
    return docs


@api_router.delete("/admin/media/{media_id}")
async def admin_media_delete(media_id: str, admin: dict = Depends(get_current_admin)):
    doc = await db.media.find_one({"id": media_id, "is_deleted": False})
    if not doc:
        raise HTTPException(status_code=404, detail="File not found")
    await db.media.update_one({"id": media_id}, {"$set": {"is_deleted": True}})
    if doc.get("storage") == "local":
        try:
            (UPLOAD_DIR / doc["storage_path"]).unlink(missing_ok=True)
        except Exception as exc:
            logger.warning("Could not remove file %s: %s", doc.get("storage_path"), exc)
    return {"ok": True}


# Include the router in the main app
app.include_router(api_router)

# Locally stored uploads (when object storage is not configured)
from fastapi.staticfiles import StaticFiles  # noqa: E402
app.mount("/api/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# CORS: driven entirely by env. In prod set CORS_ORIGINS to the real frontend
# domain(s) (comma-separated). Wildcard "*" is only a dev fallback.
cors_origins = [o.strip() for o in os.environ.get('CORS_ORIGINS', '*').split(',') if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global error handler: never leak stack traces to clients.
@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error on %s %s", request.method, request.url.path)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


@app.on_event("startup")
async def startup_storage():
    if not EMERGENT_KEY:
        logger.info("Object storage not configured — uploads are stored on local disk at %s", UPLOAD_DIR)
        return
    try:
        init_storage()
        logger.info("Object storage initialized")
    except Exception as exc:
        logger.error("Storage init failed at startup: %s", exc)


@app.on_event("startup")
async def migrate_legacy_cms():
    """One-time import of content saved by the previous (v1) editor:
    site_content {id:"site"} (hero/about/brand/seo text) and the `products` collection.
    Runs only if the new content document does not exist yet."""
    try:
        if await db.site_content.find_one({"key": "site"}):
            return
        legacy = await db.site_content.find_one({"id": "site"}, {"_id": 0})
        products = await db.products.find({}, {"_id": 0}).sort("order", 1).to_list(200)
        if not legacy and not products:
            return
        content: dict = {}
        if legacy:
            for section in ("brand", "about", "seo"):
                if isinstance(legacy.get(section), dict):
                    content[section] = {k: v for k, v in legacy[section].items() if isinstance(v, (str, int, float, bool))}
            hero = legacy.get("hero") or {}
            keep = {k: hero[k] for k in ("brandLine", "primaryCta", "secondaryCta") if isinstance(hero.get(k), str)}
            if keep:
                content["hero"] = keep
        if products:
            content["products"] = {"items": [
                {
                    "slug": p.get("slug", ""), "icon": p.get("icon", "Nut"), "name": p.get("name", ""), "tagline": p.get("tagline", ""),
                    "image": p.get("image") or "", "gallery": p.get("gallery") or [], "price": p.get("price", ""),
                    "description": p.get("description", ""), "features": p.get("features") or [], "note": p.get("note", ""),
                }
                for p in products
            ]}
        now = datetime.now(timezone.utc).isoformat()
        await db.site_content.insert_one({"key": "site", "content": content, "updated_at": now, "updated_by": "migration", "note": "imported from v1 editor"})
        logger.info("Migrated legacy CMS content (%d products)", len(products))
    except Exception as exc:
        logger.error("Legacy CMS migration failed: %s", exc)


@app.on_event("startup")
async def startup_auth():
    try:
        await db.users.create_index("email", unique=True)
        await db.users.create_index("id", unique=True)
        existing = await db.users.find_one({"email": ADMIN_EMAIL})
        if existing is None:
            await db.users.insert_one({
                "id": str(uuid.uuid4()),
                "email": ADMIN_EMAIL,
                "password_hash": hash_password(ADMIN_PASSWORD),
                "name": "Admin",
                "role": "admin",
                "created_at": datetime.now(timezone.utc).isoformat(),
            })
            logger.info("Seeded admin user %s", ADMIN_EMAIL)
        elif not verify_password(ADMIN_PASSWORD, existing.get("password_hash", "")):
            await db.users.update_one({"email": ADMIN_EMAIL}, {"$set": {"password_hash": hash_password(ADMIN_PASSWORD)}})
            logger.info("Updated admin password for %s", ADMIN_EMAIL)
    except Exception as exc:
        logger.error("Admin seeding failed: %s", exc)
