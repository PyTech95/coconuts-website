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
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

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
    path = f"{APP_NAME}/logos/{uuid.uuid4()}.{ext}"
    try:
        result = put_object(path, data, file.content_type or MIME_TYPES.get(ext, "application/octet-stream"))
    except Exception as exc:
        logger.exception("Logo upload failed: %s", exc)
        raise HTTPException(status_code=502, detail="Could not store the image. Please try again.")
    stored_path = result["path"]
    await db.logos.insert_one({
        "id": str(uuid.uuid4()),
        "storage_path": stored_path,
        "original_filename": file.filename,
        "content_type": file.content_type,
        "size": result.get("size", len(data)),
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"path": stored_path, "url": f"/api/files/{stored_path}"}


@api_router.get("/files/{path:path}")
async def serve_file(path: str):
    """Public serve of an uploaded logo/image by its storage path."""
    record = await db.logos.find_one({"storage_path": path, "is_deleted": False})
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    try:
        data, content_type = get_object(path)
    except Exception as exc:
        logger.exception("File serve failed for %s: %s", path, exc)
        raise HTTPException(status_code=502, detail="Could not load the image.")
    return Response(content=data, media_type=record.get("content_type") or content_type)


# Include the router in the main app
app.include_router(api_router)

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
    try:
        init_storage()
        logger.info("Object storage initialized")
    except Exception as exc:
        logger.error("Storage init failed at startup: %s", exc)


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
