import os
import sentry_sdk
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from .config import settings

if settings.SENTRY_DSN:
    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        environment=settings.SENTRY_ENV,
        traces_sample_rate=settings.SENTRY_TRACES_SAMPLE_RATE,
        send_default_pii=False,
    )
from .db import Base, engine, ensure_columns
from . import models  # noqa: F401 register models
from . import scheduler as scheduler_mod
from .routers import auth_r, brands, posts, metrics, connections, goals, ai, media, oauth_linkedin, oauth_meta, oauth_google

Base.metadata.create_all(bind=engine)
ensure_columns()

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

app = FastAPI(title="Orbit API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"ok": True}


app.include_router(auth_r.router, prefix="/api")
app.include_router(brands.router, prefix="/api")
app.include_router(posts.router, prefix="/api")
app.include_router(metrics.router, prefix="/api")
app.include_router(connections.router, prefix="/api")
app.include_router(goals.router, prefix="/api")
app.include_router(ai.router, prefix="/api")
app.include_router(media.router, prefix="/api")
app.include_router(oauth_linkedin.router, prefix="/api")
app.include_router(oauth_meta.router, prefix="/api")
app.include_router(oauth_google.router, prefix="/api")


@app.on_event("startup")
def _start_scheduler() -> None:
    scheduler_mod.start()


@app.on_event("shutdown")
def _stop_scheduler() -> None:
    scheduler_mod.stop()

app.mount(settings.UPLOAD_PUBLIC_BASE, StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")


# Serve the built frontend (Vite `npm run build` output) when present.
# In Docker this lives at /app/dist; locally it's skipped and Vite handles dev.
DIST_DIR = os.environ.get("ORBIT_DIST_DIR") or os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "dist")
)
if os.path.isdir(DIST_DIR):
    assets_dir = os.path.join(DIST_DIR, "assets")
    if os.path.isdir(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    def spa_fallback(full_path: str):
        if full_path.startswith("api"):
            raise HTTPException(status_code=404)
        candidate = os.path.join(DIST_DIR, full_path)
        if full_path and os.path.isfile(candidate):
            return FileResponse(candidate)
        return FileResponse(os.path.join(DIST_DIR, "index.html"))
