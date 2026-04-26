# Orbit — Social Media Management (Fullstack)

React (Vite + TS) frontend · FastAPI + SQLAlchemy backend · SQLite for dev (Postgres optional).
Design ported from the Claude-designed **Orbit** bundle in `_design/`.

## Project layout

```
cntnt/
├── _design/         # original Claude design export (reference only — not built)
├── backend/         # FastAPI app
└── frontend/        # Vite + React + TypeScript app
```

## Quick start

Run the backend on **`:8000`** and the frontend on **`:5173`** in two terminals.

### 1. Backend → http://127.0.0.1:8000

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt

# Default uses SQLite (zero setup). Switch to Postgres by editing DATABASE_URL.
cp .env.example .env 2>/dev/null || true

# Seed: demo user + 5 brands + 90 days of metrics
.venv/bin/python -m app.seed

# Start the API on port 8000 (default)
.venv/bin/uvicorn app.main:app --reload --port 8000
```

OpenAPI docs at http://127.0.0.1:8000/docs.

### 2. Frontend → http://localhost:5173

```bash
cd frontend
npm install
npm run dev          # serves on :5173, proxies /api/* → http://127.0.0.1:8000
```

Open http://localhost:5173 in your browser.

### Demo login

```
email:    demo@orbit.app
password: demo1234
```

Signup flow uses a mocked OTP — the code is always `000000`.

## Using Postgres instead of SQLite

Point `DATABASE_URL` at your Postgres instance in `backend/.env`:

```
DATABASE_URL=postgresql+psycopg://postgres:orbit@localhost:5432/orbit
```

Then re-seed: `.venv/bin/python -m app.seed`.

## What's wired end-to-end

| Feature | Screen | Backend |
|---|---|---|
| Auth | `Login`, `Verify` | `/auth/signup`, `/auth/verify`, `/auth/login`, `/me` |
| Dashboard | `Dashboard` | `/metrics/summary` + `/posts?status=scheduled` |
| Composer | `Composer` | `POST /posts` (draft/scheduled/published), `/ai/caption` |
| Calendar | `Calendar` | `/posts?month=YYYY-MM` |
| Library | `Library` | `/posts?status=&brand_id=`, `DELETE /posts/{id}` |
| Performance | `Performance` | `/metrics/timeseries`, `/metrics/heatmap` |
| Goals | `Goals` | `/goals`, `/goals/{id}/progress` |
| Settings | `Settings` | `/connections` (mock OAuth) |

Remaining design screens (Autopilot, Ask Orbit, Automations, Predict, Brand DNA) render static previews — their backend hooks are marked TODO.

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
GET   /api/goals
POST  /api/goals
DEL   /api/goals/{id}
GET   /api/goals/{id}/progress
POST  /api/ai/caption         {brand_id, platform, topic, tone}
POST  /api/ai/chat            {messages, brand_id?}
```

All routes except `/api/auth/*` require `Authorization: Bearer <jwt>`.

## Data model

- `User` — email, password_hash, name, role, verified
- `Brand` — belongs to user; seeded with 5 (Luma Studio, Arc & Oak, Kinfolk Coffee, Verge Athletics, Mira Botanics)
- `Connection` — platform connection per brand (mock OAuth)
- `Post` — caption, platforms[], scheduled_at, status, media_urls[]
- `Goal` — title, metric, target, period
- `MetricSample` — reach, engagement, saves, clicks per platform per timestamp

Seed script (`python -m app.seed`) generates 90 days of metric samples and ~100 posts (published + scheduled) across all 5 brands.

## Going live — env vars

Real platform OAuth + publishing are wired but inert until you populate credentials.

```bash
# backend/.env

# Token-at-rest encryption (Fernet key — REQUIRED in prod)
TOKEN_ENC_KEY=$(python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())")

# LinkedIn (Sign In with LinkedIn using OIDC + Share on LinkedIn products)
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
LINKEDIN_REDIRECT_URI=http://localhost:8000/api/oauth/linkedin/callback

# Meta (Facebook Pages + Instagram Business via one app)
META_CLIENT_ID=
META_CLIENT_SECRET=
META_REDIRECT_URI=http://localhost:8000/api/oauth/meta/callback

# Google / YouTube (OAuth consent screen in "Testing" mode supports up to
# 100 test users without verification — perfect for staging)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:8000/api/oauth/google/callback

# Optional
SENTRY_DSN=
STORAGE_BACKEND=local         # or `s3`
S3_BUCKET=
SCHEDULER_ENABLED=1
SCHEDULER_INTERVAL_SECONDS=30
```

Connect from the Settings screen — "Connect with LinkedIn" / "Connect with Meta" trigger the real OAuth flow. Tokens are stored Fernet-encrypted on `Connection`. The APScheduler tick (`backend/app/scheduler.py`) picks up scheduled posts whose `scheduled_at` has passed and calls the per-platform publisher.

## Database migrations

We use Alembic.

```bash
cd backend
.venv/bin/alembic upgrade head                   # apply pending migrations
.venv/bin/alembic revision --autogenerate -m "msg"   # after model changes
```

For dev convenience, `db.ensure_columns()` ALTERs SQLite databases on startup so a stale dev DB doesn't need a full reset for additive changes. Production should rely solely on Alembic.

## Tests

```bash
cd backend
.venv/bin/pytest tests/ -q
```

The happy-path test ([tests/test_publish_happy_path.py](backend/tests/test_publish_happy_path.py)) creates a scheduled LinkedIn post, monkey-patches the LinkedIn HTTP client, drives `scheduler.tick()`, and asserts the post flips to `published` with the returned URN stored in `external_ids`.

## Notes & scope

- **OTP delivery** is mocked (`000000`). Swap in an email provider for real flow.
- **YouTube** publisher is implemented ([publishers/youtube.py](backend/app/publishers/youtube.py)) — uploads via the multipart `videos.insert` endpoint, refreshes the access token automatically. Connect via **Settings → Connect with Google**. Keep the GCP OAuth consent screen in "Testing" mode for up to 100 test users; verification is required only when going public to >100 users. **Threads** is still not implemented.
- **Meta App Review** package: see [docs/META_APP_REVIEW.md](docs/META_APP_REVIEW.md) — privacy policy template, demo-video script, permissions writeups, and a pre-submission checklist.
- **S3 storage** is implemented but untested in CI; provision an IAM user with `s3:PutObject` on the bucket and set `S3_BUCKET` + `S3_PUBLIC_BASE` (or a CDN domain).
- **Sentry** is wired but only initializes when `SENTRY_DSN` is set.
