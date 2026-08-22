"""CMS backend tests: auth, content, products, orders, enquiries admin ops."""
import os
import io
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://full-stack-coconatu.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"
ADMIN_EMAIL = "admin@mrcoconetto.com"
ADMIN_PASS = "Coconetto@2026"


@pytest.fixture(scope="module")
def token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASS})
    assert r.status_code == 200, r.text
    return r.json()["access_token"]


@pytest.fixture(scope="module")
def h(token):
    return {"Authorization": f"Bearer {token}"}


# -- Auth --
class TestAuth:
    def test_login_ok(self, token):
        assert isinstance(token, str) and len(token) > 20

    def test_login_bad(self):
        r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
        assert r.status_code == 401

    def test_me(self, h):
        r = requests.get(f"{API}/auth/me", headers=h)
        assert r.status_code == 200
        assert r.json()["email"] == ADMIN_EMAIL


# -- Content --
class TestContent:
    def test_get_content(self):
        r = requests.get(f"{API}/content")
        assert r.status_code == 200
        d = r.json()
        assert "hero" in d and "about" in d and "seo" in d

    def test_put_content_persists(self, h):
        # backup
        orig = requests.get(f"{API}/content").json()
        original_sub = orig["hero"].get("subheading")
        marker = "TEST_SUBHEAD_MARKER"
        r = requests.put(f"{API}/content", json={"hero": {"subheading": marker}}, headers=h)
        assert r.status_code == 200
        got = requests.get(f"{API}/content").json()
        assert got["hero"]["subheading"] == marker
        # untouched keys still there
        assert got["hero"].get("titleAccent") == orig["hero"].get("titleAccent")
        # revert
        requests.put(f"{API}/content", json={"hero": {"subheading": original_sub}}, headers=h)
        after = requests.get(f"{API}/content").json()
        assert after["hero"]["subheading"] == original_sub

    def test_put_content_requires_auth(self):
        r = requests.put(f"{API}/content", json={"hero": {"subheading": "x"}})
        assert r.status_code == 401


# -- Products --
class TestProducts:
    def test_list_products(self):
        r = requests.get(f"{API}/products")
        assert r.status_code == 200
        prods = r.json()
        assert isinstance(prods, list) and len(prods) >= 5
        slugs = {p["slug"] for p in prods}
        assert "personalized-coconut" in slugs

    def test_get_by_slug(self):
        r = requests.get(f"{API}/products/personalized-coconut")
        assert r.status_code == 200
        assert r.json()["slug"] == "personalized-coconut"

    def test_get_missing_slug_404(self):
        r = requests.get(f"{API}/products/does-not-exist-xyz")
        assert r.status_code == 404

    def test_create_update_delete(self, h):
        payload = {"name": "TEST_Product", "tagline": "temp", "features": ["a", "b"], "gallery": [], "icon": "Nut"}
        r = requests.post(f"{API}/admin/products", json=payload, headers=h)
        assert r.status_code == 200, r.text
        prod = r.json()
        pid = prod["id"]
        assert prod["name"] == "TEST_Product"
        assert prod["slug"].startswith("test-product")
        # verify in list
        listed = requests.get(f"{API}/products").json()
        assert any(p["id"] == pid for p in listed)
        # update
        upd = requests.put(f"{API}/admin/products/{pid}", json={"name": "TEST_Product2", "tagline": "updated"}, headers=h)
        assert upd.status_code == 200
        assert upd.json()["tagline"] == "updated"
        # verify via GET by slug
        got = requests.get(f"{API}/products/{prod['slug']}")
        assert got.status_code == 200
        assert got.json()["tagline"] == "updated"
        # delete
        d = requests.delete(f"{API}/admin/products/{pid}", headers=h)
        assert d.status_code == 200
        # verify gone
        listed2 = requests.get(f"{API}/products").json()
        assert not any(p["id"] == pid for p in listed2)

    def test_admin_products_requires_auth(self):
        r = requests.post(f"{API}/admin/products", json={"name": "x"})
        assert r.status_code == 401


# -- Orders / Enquiries admin ops --
class TestOrdersAdmin:
    def test_create_and_patch_delete_order(self, h):
        # Create an order via public endpoint
        payload = {"print_text": "TEST_ORDER", "event_name": "TEST Event", "mobile": "9999999999"}
        r = requests.post(f"{API}/orders", json=payload)
        assert r.status_code == 200
        oid = r.json()["id"]
        # patch status
        p = requests.patch(f"{API}/admin/orders/{oid}", json={"status": "ready"}, headers=h)
        assert p.status_code == 200
        # verify persisted
        lst = requests.get(f"{API}/admin/orders", headers=h).json()
        row = next((o for o in lst if o["id"] == oid), None)
        assert row and row["status"] == "ready"
        # delete
        d = requests.delete(f"{API}/admin/orders/{oid}", headers=h)
        assert d.status_code == 200
        lst2 = requests.get(f"{API}/admin/orders", headers=h).json()
        assert not any(o["id"] == oid for o in lst2)


# -- Upload endpoint --
class TestUpload:
    def test_upload_logo(self):
        # 1x1 PNG
        png = bytes.fromhex("89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d49444154789c63f8cfc0f01f0005000100207c1f970000000049454e44ae426082")
        files = {"file": ("t.png", io.BytesIO(png), "image/png")}
        r = requests.post(f"{API}/upload-logo", files=files)
        assert r.status_code == 200, r.text
        j = r.json()
        assert j["url"].startswith("/api/files/")
