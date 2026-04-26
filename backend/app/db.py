from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker
from .config import settings

connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(settings.DATABASE_URL, connect_args=connect_args, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def ensure_columns() -> None:
    """Lightweight SQLite-friendly ALTERs so dev DBs don't need a full reset
    every time we add a column. Production should switch to Alembic."""
    inspector = inspect(engine)
    additions = {
        "connections": [
            ("external_account_id", "VARCHAR"),
            ("access_token", "VARCHAR(2048)"),
            ("refresh_token", "VARCHAR(2048)"),
            ("token_expires_at", "DATETIME"),
            ("scopes", "VARCHAR"),
            ("status", "VARCHAR DEFAULT 'active'"),
            ("last_error", "VARCHAR"),
        ],
        "posts": [
            ("external_ids", "JSON"),
            ("last_error", "VARCHAR"),
        ],
    }
    with engine.begin() as conn:
        for table, cols in additions.items():
            if not inspector.has_table(table):
                continue
            existing = {c["name"] for c in inspector.get_columns(table)}
            for name, ddl in cols:
                if name not in existing:
                    conn.execute(text(f'ALTER TABLE {table} ADD COLUMN {name} {ddl}'))
