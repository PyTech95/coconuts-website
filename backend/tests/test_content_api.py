"""CMS content + media API tests. Run with an in-memory DB:

    cd backend && MONGO_URL=mock:// JWT_SECRET=test ADMIN_EMAIL=a@b.com ADMIN_PASSWORD=pw pytest tests/test_content_api.py -v
"""
import io
import os

import pytest

os.environ.setdefault("MONGO_URL", "mock://")
os.environ.setdefault("JWT_SECRET", "test-secret")
os.environ.setdefault("ADMIN_EMAIL", "admin@test.com")
os.environ.setdefault("ADMIN_PASSWORD", "test-pass")
os.environ.setdefault("UPLOAD_DIR", "/tmp/mc_test_uploads")

from fastapi.testclient import TestClient  # noqa: E402

import server  # noqa: E402


@pytest.fixture(scope="module")
def client():
    with TestClient(server.app) as c:
        yield c


@pytest.fixture(scope="module")
def auth(client):
    r = client.post("/api/auth/login", json={"email": os.environ["ADMIN_EMAIL"], "password": os.environ["ADMIN_PASSWORD"]})
    assert r.status_code == 200, r.text
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def test_content_empty_by_default(client):
    r = client.get("/api/content")
    assert r.status_code == 200
    assert r.json()["content"] is None


def test_put_requires_admin(client):
    assert client.put("/api/content", json={"content": {"x": 1}}).status_code == 401


def test_put_get_and_revisions(client, auth):
    assert client.put("/api/content", json={"content": {"hero": {"brandLine": "v1"}}}, headers=auth).status_code == 200
    assert client.put("/api/content", json={"content": {"hero": {"brandLine": "v2"}}}, headers=auth).status_code == 200
    assert client.get("/api/content").json()["content"]["hero"]["brandLine"] == "v2"
    revs = client.get("/api/admin/content/revisions", headers=auth).json()
    assert len(revs) == 1 and "content" not in revs[0]
    r = client.post(f"/api/admin/content/revisions/{revs[0]['id']}/restore", headers=auth)
    assert r.status_code == 200
    assert client.get("/api/content").json()["content"]["hero"]["brandLine"] == "v1"


def test_upload_list_delete_media(client, auth):
    png = b"\x89PNG\r\n\x1a\n" + b"0" * 100
    r = client.post("/api/admin/upload", files={"file": ("a.png", io.BytesIO(png), "image/png")}, headers=auth)
    assert r.status_code == 200, r.text
    media = r.json()
    assert media["type"] == "image" and media["url"].startswith("/api/")
    assert client.get(media["url"]).status_code == 200
    assert any(m["id"] == media["id"] for m in client.get("/api/admin/media", headers=auth).json())
    assert client.delete(f"/api/admin/media/{media['id']}", headers=auth).status_code == 200
    assert all(m["id"] != media["id"] for m in client.get("/api/admin/media", headers=auth).json())


def test_upload_rejects_other_types(client, auth):
    r = client.post("/api/admin/upload", files={"file": ("a.txt", io.BytesIO(b"hi"), "text/plain")}, headers=auth)
    assert r.status_code == 400


def test_order_status_and_delete(client, auth):
    r = client.post("/api/orders", json={"print_text": "A & B", "event_name": "Wedding", "mobile": "9876543210"})
    assert r.status_code == 200
    oid = r.json()["id"]
    assert r.json()["status"] == "new"
    assert client.patch(f"/api/admin/orders/{oid}", json={"status": "confirmed"}, headers=auth).json()["status"] == "confirmed"
    assert any(o["id"] == oid and o["status"] == "confirmed" for o in client.get("/api/admin/orders", headers=auth).json())
    assert client.delete(f"/api/admin/orders/{oid}", headers=auth).status_code == 200
    assert all(o["id"] != oid for o in client.get("/api/admin/orders", headers=auth).json())
