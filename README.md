# Mr. Coconetto — Website + CMS

Premium personalized-coconut brand website with a **full content editor**:

* **Live Editor** — open the site with `?edit=1` (after admin login) and click on any text,
  image, video or section to edit it in place: text, font, size, weight, colour, highlight,
  alignment, section background colour, hide/show, replace images & videos, add / remove /
  reorder slides, services, plans, products, blog posts, FAQs, testimonials, cities…
* **Backend Editor** — `/admin`: form-based editor for every section, Blog & Products CRUD,
  Media Library (upload photos / short videos), Theme (brand colours, light background
  tints, fonts), plus the Orders & Enquiries inbox.
* **Hero slider** — animated Ken-Burns image slides mixed with short autoplaying video
  clips, text bottom-left, buttons right, arrows / dots / progress, pause on hover.

```
frontend/   React 19 (CRA + craco), Tailwind, shadcn/ui, framer-motion
backend/    FastAPI + MongoDB (motor)
```

## Run locally

```bash
# backend
cd backend
cp .env.example .env            # edit values; MONGO_URL=mock:// works without MongoDB
pip install -r requirements.txt  # (+ requirements-dev.txt for mock DB / tests)
uvicorn server:app --reload --port 8000

# frontend
cd frontend
cp .env.example .env            # REACT_APP_BACKEND_URL=http://localhost:8000
yarn install
yarn start                       # http://localhost:3000
```

Admin login: `/admin/login` — credentials come from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in
`backend/.env` (the admin user is created/updated on backend start).

## How content works

* All default content lives in `frontend/src/cms/defaultContent.js` (texts, images, lists,
  theme colours).
* Saved edits are stored in MongoDB (`site_content` collection) via `GET/PUT /api/content`
  and merged over the defaults at runtime — so new keys added in code keep working and
  the client's edits are never lost. The last 30 versions are kept in `content_revisions`.
* Uploaded media is stored in Emergent object storage when `EMERGENT_LLM_KEY` is set,
  otherwise on local disk (`UPLOAD_DIR`, served from `/api/uploads/...`).
* Components use `useContent()` + `<T path="…"/>` (text), `<Img path="…"/>`, `<Vid/>`,
  `<Sec id="…"/>` (section) and `<ListTools path="…"/>` from `src/cms/Editable.jsx`.
  The admin forms are generated from `src/cms/schema.js`.

### Background colours
Light tints were darkened ~50 % vs. the original Tailwind `pink-50 / green-50` etc. They are
CSS variables (`frontend/src/index.css`) wired into Tailwind (`tailwind.config.js`) and
editable from **Admin → Theme**.

## API

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/content` | public | current site content |
| PUT | `/api/content` | admin | save content (keeps revisions) |
| GET | `/api/admin/content/revisions` | admin | list revisions |
| POST | `/api/admin/content/revisions/{id}/restore` | admin | restore a revision |
| POST | `/api/admin/upload` | admin | upload image (≤15 MB) or video (≤60 MB) |
| GET | `/api/admin/media` | admin | media library |
| DELETE | `/api/admin/media/{id}` | admin | delete media |
| POST | `/api/auth/login` | public | admin login → Bearer token |
| GET | `/api/admin/orders`, `/api/admin/enquiries` | admin | inbox |
| POST | `/api/orders`, `/api/enquiries`, `/api/upload-logo` | public | customer flows |

## Production notes

* Set `CORS_ORIGINS` to the real domain(s), a strong `JWT_SECRET` and `ADMIN_PASSWORD`.
* Serve `frontend/build` as a single-page app (all routes → `index.html`).
* Set `REACT_APP_BACKEND_URL` before `yarn build` (or leave empty when `/api` is proxied on
  the same domain).
* `scripts/build-preview.sh` builds a static demo (hash routing, no backend, edits kept in
  the browser) — used only for previews.
