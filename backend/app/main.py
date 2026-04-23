from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .db import Base, engine
from . import models  # noqa: F401 register models
from .routers import auth_r, brands, posts, metrics, connections, goals, ai

Base.metadata.create_all(bind=engine)

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
