# Orbit — Social Media Management (Fullstack)

React (Vite + TS) frontend · FastAPI + SQLAlchemy backend · Postgres (or SQLite for dev).
Design ported from the Claude-designed **Orbit** bundle in `_design/`.

## Project layout

```
cntnt/
├── _design/         # original Claude design export (reference only — not built)
├── backend/         # FastAPI app
└── frontend/        # Vite + React + TypeScript app
```

## Quick start (dev)

Two terminals.

### 1. Backend

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt

# Default .env uses SQLite (zero setup). Switch to Postgres by editing DATABASE_URL.
cp .env.example .env
.venv/bin/python -m app.seed          # creates demo user + 5 brands + 30 days of data
.venv/bin/uvicorn app.main:app --reload
```

API lives at http://127.0.0.1:8000. OpenAPI docs at http://127.0.0.1:8000/docs.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App at http://localhost:5173. Vite proxies `/api/*` → `http://127.0.0.1:8000`.

### Demo login

```
email:    demo@orbit.app
password: demo1234
```

Signup flow uses a mocked OTP — the code is always `000000`.

## Using Postgres instead of SQLite

One-liner via Docker:

```bash
docker run --name orbit-pg -e POSTGRES_PASSWORD=orbit -e POSTGRES_DB=orbit -p 5432:5432 -d postgres:16
```

Edit `backend/.env`:

```
DATABASE_URL=postgresql+psycopg://postgres:orbit@localhost:5432/orbit
```

Re-seed: `.venv/bin/python -m app.seed`.

## What's wired end-to-end

| Feature | Screen | Backend |
|---|---|---|
| Auth | `Login`, `Verify` | `/auth/signup`, `/auth/verify`, `/auth/login`, `/me` |
| Dashboard | `Dashboard` | `/metrics/summary` + `/posts?status=scheduled` |
| Composer | `Composer` | `POST /posts` (draft/scheduled/published) |
| Calendar | `Calendar` | `/posts?month=YYYY-MM` |
| Library | `Library` | `/posts?status=&brand_id=`, `DELETE /posts/{id}` |
| Performance | `Performance` | `/metrics/timeseries`, `/metrics/heatmap` |
| Settings | `Settings` | `/connections` (mock OAuth) |

Remaining design screens (Autopilot, Goals, Ask Orbit, Automations, Predict, Brand DNA) render static previews — their backend hooks are marked TODO.

## API surface

```
POST  /api/auth/signup        {email, password, name}
POST  /api/auth/verify        {email, code}   → {access_token}
POST  /api/auth/login         {email, password} → {access_token}
GET   /api/me                                → {user, brands}
GET   /api/brands
GET   /api/posts?status=&brand_id=&month=YYYY-MM
POST  /api/posts              {brand_id, caption, platforms[], media_urls[], scheduled_at, status}
PATCH /api/posts/{id}
DEL   /api/posts/{id}
GET   /api/metrics/summary?brand_id=&range=7d
GET   /api/metrics/timeseries?metric=reach|engagement|saves|clicks&platform=&range=30d
GET   /api/metrics/heatmap?brand_id=
GET   /api/connections
POST  /api/connections        {brand_id, platform, handle}
DEL   /api/connections/{id}
```

All routes except `/api/auth/*` require `Authorization: Bearer <jwt>`.

## Data model

- `User` — email, password_hash, name, role, verified
- `Brand` — belongs to user; seeded with 5 (Luma Studio, Arc & Oak, Kinfolk Coffee, Verge Athletics, Mira Botanics)
- `Connection` — platform connection per brand (mock OAuth)
- `Post` — caption, platforms[], scheduled_at, status
- `MetricSample` — reach, engagement, saves, clicks per platform per timestamp

Seed script (`python -m app.seed`) generates 90 days of metric samples and ~100 posts (published + scheduled) across all 5 brands.

## Notes & scope

- **OTP delivery** is mocked (`000000`). Swap in an email provider for real flow.
- **Platform connections** store mock tokens — no real OAuth. Replace `connections.py` with per-platform OAuth flows when integrating.
- **Media uploads** not implemented in v1; add multipart endpoint + `uploads/` static mount.
- **Scheduled publishing** has no background worker — posts stay in `scheduled` status. Add APScheduler/Celery to actually publish.
