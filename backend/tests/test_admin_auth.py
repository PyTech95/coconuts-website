"""Admin auth (JWT) + Admin Inbox endpoints + email no-op behaviour tests."""
import os
import re
import pytest
import requests
from dotenv import dotenv_values

frontend_env = dotenv_values("/app/frontend/.env")
BASE_URL = (os.environ.get("REACT_APP_BACKEND_URL") or frontend_env.get("REACT_APP_BACKEND_URL")).rstrip("/")

ADMIN_EMAIL = "admin@mrcoconetto.com"
ADMIN_PASSWORD = "Coconetto@2026"
ORDER_NO_RE = re.compile(r"^MC-[A-Z0-9]{6}$")


@pytest.fixture(scope="module")
def api():
    return requests.Session()


@pytest.fixture(scope="module")
def admin_token(api):
    r = api.post(f"{BASE_URL}/api/auth/login",
                 json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "access_token" in data and isinstance(data["access_token"], str)
    assert data["user"]["role"] == "admin"
    assert data["user"]["email"] == ADMIN_EMAIL
    return data["access_token"]


class TestAuth:
    def test_login_success(self, api):
        r = api.post(f"{BASE_URL}/api/auth/login",
                     json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["user"]["role"] == "admin"
        assert d["user"]["email"] == ADMIN_EMAIL
        assert len(d["access_token"]) > 20

    def test_login_wrong_password(self, api):
        r = api.post(f"{BASE_URL}/api/auth/login",
                     json={"email": ADMIN_EMAIL, "password": "wrong-password"}, timeout=30)
        assert r.status_code == 401

    def test_login_unknown_email(self, api):
        r = api.post(f"{BASE_URL}/api/auth/login",
                     json={"email": "nobody@mrcoconetto.com", "password": "x"}, timeout=30)
        assert r.status_code == 401

    def test_me_without_token(self, api):
        r = api.get(f"{BASE_URL}/api/auth/me", timeout=30)
        assert r.status_code == 401

    def test_me_with_token(self, api, admin_token):
        r = api.get(f"{BASE_URL}/api/auth/me",
                    headers={"Authorization": f"Bearer {admin_token}"}, timeout=30)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["email"] == ADMIN_EMAIL
        assert d["role"] == "admin"

    def test_me_with_bad_token(self, api):
        r = api.get(f"{BASE_URL}/api/auth/me",
                    headers={"Authorization": "Bearer not.a.jwt"}, timeout=30)
        assert r.status_code == 401


class TestAdminInbox:
    def test_orders_requires_auth(self, api):
        r = api.get(f"{BASE_URL}/api/admin/orders", timeout=30)
        assert r.status_code == 401

    def test_enquiries_requires_auth(self, api):
        r = api.get(f"{BASE_URL}/api/admin/enquiries", timeout=30)
        assert r.status_code == 401

    def test_orders_list(self, api, admin_token):
        r = api.get(f"{BASE_URL}/api/admin/orders",
                    headers={"Authorization": f"Bearer {admin_token}"}, timeout=30)
        assert r.status_code == 200, r.text
        d = r.json()
        assert isinstance(d, list)
        for o in d:
            assert "_id" not in o

    def test_enquiries_list(self, api, admin_token):
        r = api.get(f"{BASE_URL}/api/admin/enquiries",
                    headers={"Authorization": f"Bearer {admin_token}"}, timeout=30)
        assert r.status_code == 200, r.text
        d = r.json()
        assert isinstance(d, list)
        for e in d:
            assert "_id" not in e


class TestEmailNoOp:
    """Order/Enquiry creation must NOT fail when RESEND_API_KEY is empty."""

    def test_order_create_no_email_key(self, api, admin_token):
        payload = {"print_text": "TEST_email noop", "event_name": "TEST_Wedding", "mobile": "+919999000123"}
        r = api.post(f"{BASE_URL}/api/orders", json=payload, timeout=30)
        assert r.status_code in (200, 201), r.text
        d = r.json()
        assert ORDER_NO_RE.match(d["order_number"])
        order_no = d["order_number"]

        # verify appears in admin orders (most-recent-first)
        r2 = api.get(f"{BASE_URL}/api/admin/orders",
                     headers={"Authorization": f"Bearer {admin_token}"}, timeout=30)
        assert r2.status_code == 200
        nums = [o["order_number"] for o in r2.json()]
        assert order_no in nums

    def test_enquiry_create_no_email_key(self, api, admin_token):
        payload = {"name": "TEST_NoOp Lead", "whatsapp": "+919999000124",
                   "eventType": "Wedding", "location": "TEST_Delhi"}
        r = api.post(f"{BASE_URL}/api/enquiries", json=payload, timeout=30)
        assert r.status_code in (200, 201), r.text
        eid = r.json()["id"]

        r2 = api.get(f"{BASE_URL}/api/admin/enquiries",
                     headers={"Authorization": f"Bearer {admin_token}"}, timeout=30)
        assert r2.status_code == 200
        ids = [e["id"] for e in r2.json()]
        assert eid in ids

    def test_admin_orders_sorted_desc(self, api, admin_token):
        r = api.get(f"{BASE_URL}/api/admin/orders",
                    headers={"Authorization": f"Bearer {admin_token}"}, timeout=30)
        assert r.status_code == 200
        docs = r.json()
        if len(docs) >= 2:
            assert docs[0]["created_at"] >= docs[1]["created_at"]
