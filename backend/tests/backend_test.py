"""Backend API tests for Mr. Coconetto.

Covers: health, root, enquiries (create/validation), orders (create + multi-line
print_text + uniqueness + validation), and object-storage logo upload/serve.
"""
import io
import os
import re
import struct
import zlib

import pytest
import requests
from dotenv import dotenv_values

frontend_env = dotenv_values("/app/frontend/.env")
base_url = os.environ.get("REACT_APP_BACKEND_URL") or frontend_env.get("REACT_APP_BACKEND_URL")
if not base_url:
    raise RuntimeError("REACT_APP_BACKEND_URL missing")
BASE_URL = base_url.rstrip("/")

ORDER_NO_RE = re.compile(r"^MC-[A-Z0-9]{6}$")


def _make_png(w: int = 2, h: int = 2) -> bytes:
    """Build a tiny valid PNG in-memory (no Pillow dependency)."""
    def chunk(tag: bytes, data: bytes) -> bytes:
        return struct.pack(">I", len(data)) + tag + data + struct.pack(
            ">I", zlib.crc32(tag + data) & 0xFFFFFFFF
        )
    sig = b"\x89PNG\r\n\x1a\n"
    ihdr = struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0)  # RGB
    raw = b"".join(b"\x00" + b"\xff\x00\x00" * w for _ in range(h))
    idat = zlib.compress(raw)
    return sig + chunk(b"IHDR", ihdr) + chunk(b"IDAT", idat) + chunk(b"IEND", b"")


@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    return s


# --- health ---
class TestHealth:
    def test_health(self, api):
        r = api.get(f"{BASE_URL}/api/health", timeout=30)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["status"] == "ok"
        assert d["database"] == "up"

    def test_root(self, api):
        r = api.get(f"{BASE_URL}/api/", timeout=30)
        assert r.status_code == 200
        assert "message" in r.json()


# --- enquiries ---
class TestEnquiries:
    def test_create(self, api):
        payload = {
            "name": "TEST_QA Lead",
            "whatsapp": "+919999000011",
            "eventType": "Wedding",
            "eventDate": "2026-08-15",
            "location": "TEST_Delhi",
            "quantity": "200 coconuts",
            "customization": "TEST_names + hashtag",
        }
        r = api.post(f"{BASE_URL}/api/enquiries", json=payload, timeout=30)
        assert r.status_code in (200, 201), r.text
        d = r.json()
        assert isinstance(d.get("id"), str) and d["id"]
        assert "_id" not in d
        for k, v in payload.items():
            assert d[k] == v

    @pytest.mark.parametrize("payload", [
        {"whatsapp": "+919999000011"},
        {"name": "TEST_NoWa"},
        {"name": "TEST_Short", "whatsapp": "1"},
        {},
    ])
    def test_validation(self, api, payload):
        r = api.post(f"{BASE_URL}/api/enquiries", json=payload, timeout=30)
        assert r.status_code == 422, r.text


# --- orders ---
class TestOrders:
    def test_create(self, api):
        payload = {"print_text": "TEST_P love R", "event_name": "TEST_Sangeet", "mobile": "+919999000022"}
        r = api.post(f"{BASE_URL}/api/orders", json=payload, timeout=30)
        assert r.status_code in (200, 201), r.text
        d = r.json()
        assert "_id" not in d
        assert ORDER_NO_RE.match(d.get("order_number", "")), d.get("order_number")
        assert d["print_text"] == payload["print_text"]
        assert d["event_name"] == payload["event_name"]
        assert d["mobile"] == payload["mobile"]

    def test_multiline_print_text(self, api):
        """Regression: OrderCreate.print_text now up to 60 chars and can contain newlines."""
        text = "Radha\nand\nRupesh"
        payload = {
            "print_text": text,
            "event_name": "TEST_Wedding",
            "mobile": "+919999000099",
            "logo_url": "/api/files/coconut/logos/fake.png",
            "logo_path": "coconut/logos/fake.png",
        }
        r = api.post(f"{BASE_URL}/api/orders", json=payload, timeout=30)
        assert r.status_code in (200, 201), r.text
        d = r.json()
        assert d["print_text"] == text
        assert "\n" in d["print_text"]
        assert d["logo_url"] == payload["logo_url"]
        assert d["logo_path"] == payload["logo_path"]

    def test_unique_order_numbers(self, api):
        seen = set()
        for i in range(3):
            r = api.post(f"{BASE_URL}/api/orders", json={
                "print_text": f"TEST_uniq{i}", "event_name": "TEST_E", "mobile": "+919999000033"
            }, timeout=30)
            assert r.status_code in (200, 201)
            seen.add(r.json()["order_number"])
        assert len(seen) == 3

    def test_max_60_chars_accepted(self, api):
        text = "T" * 60
        r = api.post(f"{BASE_URL}/api/orders", json={
            "print_text": text, "event_name": "TEST_B", "mobile": "+919999000044"
        }, timeout=30)
        assert r.status_code in (200, 201), r.text
        assert r.json()["print_text"] == text

    def test_logo_only_order_allowed(self, api):
        """Bug fix: order with empty print_text but a logo_url must succeed."""
        payload = {
            "print_text": "",
            "event_name": "TEST_LogoOnly",
            "mobile": "+919999000077",
            "logo_url": "/api/files/coconut/logos/some.png",
            "logo_path": "coconut/logos/some.png",
        }
        r = api.post(f"{BASE_URL}/api/orders", json=payload, timeout=30)
        assert r.status_code in (200, 201), r.text
        d = r.json()
        assert ORDER_NO_RE.match(d["order_number"])
        assert d["print_text"] == ""
        assert d["logo_url"] == payload["logo_url"]

    def test_both_empty_returns_400(self, api):
        """Bug fix: empty print_text AND empty logo_url -> 400 with helpful detail."""
        r = api.post(f"{BASE_URL}/api/orders", json={
            "print_text": "   ", "event_name": "TEST_E", "mobile": "+919999000066",
            "logo_url": "", "logo_path": "",
        }, timeout=30)
        assert r.status_code == 400, r.text
        detail = r.json().get("detail", "")
        assert "print text" in detail.lower() and "logo" in detail.lower()

    def test_text_only_order_regression(self, api):
        """Regression: text-only order (no logo) still works."""
        r = api.post(f"{BASE_URL}/api/orders", json={
            "print_text": "TEST_TextOnly", "event_name": "TEST_E", "mobile": "+919999000088"
        }, timeout=30)
        assert r.status_code in (200, 201), r.text
        assert ORDER_NO_RE.match(r.json()["order_number"])

    @pytest.mark.parametrize("payload", [
        {"print_text": "T" * 61, "event_name": "TEST_E", "mobile": "+919999000055"},
        {"print_text": "TEST_ok", "event_name": "TEST_E"},
        {"print_text": "TEST_ok", "event_name": "TEST_E", "mobile": "123"},
        {"print_text": "TEST_ok", "mobile": "+919999000055"},
        {"print_text": "TEST_ok", "event_name": "", "mobile": "+919999000055"},
        {},
    ])
    def test_order_validation(self, api, payload):
        r = api.post(f"{BASE_URL}/api/orders", json=payload, timeout=30)
        assert r.status_code == 422, f"{r.status_code}: {r.text[:200]}"


# --- object storage: logo upload + serve ---
class TestLogoUpload:
    def test_upload_png_and_serve(self, api):
        png = _make_png()
        files = {"file": ("TEST_logo.png", io.BytesIO(png), "image/png")}
        r = api.post(f"{BASE_URL}/api/upload-logo", files=files, timeout=60)
        assert r.status_code == 200, r.text
        body = r.json()
        assert "path" in body and body["path"].startswith("coconut/logos/")
        assert body["url"] == f"/api/files/{body['path']}"

        served = api.get(f"{BASE_URL}{body['url']}", timeout=60)
        assert served.status_code == 200, served.text
        ct = served.headers.get("Content-Type", "")
        assert ct.startswith("image/"), ct
        assert served.content[:8] == b"\x89PNG\r\n\x1a\n"

    def test_reject_non_image(self, api):
        files = {"file": ("hack.txt", io.BytesIO(b"not an image"), "text/plain")}
        r = api.post(f"{BASE_URL}/api/upload-logo", files=files, timeout=30)
        assert r.status_code == 400, r.text

    def test_serve_unknown_path_404(self, api):
        r = api.get(f"{BASE_URL}/api/files/coconut/logos/does-not-exist.png", timeout=30)
        assert r.status_code == 404
