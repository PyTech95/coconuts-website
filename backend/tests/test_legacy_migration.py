"""The v1 editor stored content as site_content {id:"site"} + a `products` collection.
On first start the new backend imports that data into the new content document."""
import os
import asyncio

os.environ.setdefault("MONGO_URL", "mock://")
os.environ.setdefault("JWT_SECRET", "test-secret")
os.environ.setdefault("UPLOAD_DIR", "/tmp/mc_test_uploads")

from fastapi.testclient import TestClient  # noqa: E402

import server  # noqa: E402


def test_legacy_data_is_imported():
    async def seed():
        await server.db.site_content.delete_many({})
        await server.db.products.delete_many({})
        await server.db.site_content.insert_one({"id": "site", "brand": {"name": "Old Name", "phone": "+91-1"}, "hero": {"brandLine": "Old line", "titleLine1": "x"}})
        await server.db.products.insert_one({"id": "p1", "slug": "banta-bottle", "name": "Banta", "icon": "CupSoda", "gallery": ["a.jpg"], "features": ["f"], "order": 0})
    asyncio.get_event_loop().run_until_complete(seed())
    with TestClient(server.app) as c:
        content = c.get("/api/content").json()["content"]
        assert content["brand"]["name"] == "Old Name"
        assert content["hero"] == {"brandLine": "Old line"}
        assert content["products"]["items"][0]["slug"] == "banta-bottle"
        assert content["products"]["items"][0]["gallery"] == ["a.jpg"]
