import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./orbit.db")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "dev-secret-change-me")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_EXPIRE_DAYS: int = int(os.getenv("JWT_EXPIRE_DAYS", "7"))
    CORS_ORIGINS: list[str] = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    ANTHROPIC_MODEL: str = os.getenv("ANTHROPIC_MODEL", "claude-sonnet-4-6")

    # Fernet key (urlsafe base64, 32 bytes). Generate one with:
    #   python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
    # The default below is a deterministic dev key — DO NOT use in prod.
    TOKEN_ENC_KEY: str = os.getenv(
        "TOKEN_ENC_KEY",
        "ZGV2X2Rldl9kZXZfZGV2X2Rldl9kZXZfZGV2X2Rldl9kZXY=",
    )

    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "uploads")
    UPLOAD_PUBLIC_BASE: str = os.getenv("UPLOAD_PUBLIC_BASE", "/uploads")
    MAX_UPLOAD_BYTES: int = int(os.getenv("MAX_UPLOAD_BYTES", str(25 * 1024 * 1024)))

    # LinkedIn OAuth (personal profile, "Sign In with LinkedIn using OpenID Connect"
    # + "Share on LinkedIn" products on the LinkedIn app).
    LINKEDIN_CLIENT_ID: str = os.getenv("LINKEDIN_CLIENT_ID", "")
    LINKEDIN_CLIENT_SECRET: str = os.getenv("LINKEDIN_CLIENT_SECRET", "")
    LINKEDIN_REDIRECT_URI: str = os.getenv(
        "LINKEDIN_REDIRECT_URI",
        "http://localhost:8000/api/oauth/linkedin/callback",
    )
    LINKEDIN_SCOPES: str = os.getenv(
        "LINKEDIN_SCOPES",
        "openid profile email w_member_social",
    )

    # Meta (Facebook + Instagram) OAuth. Single app covers Pages posting and
    # IG Business content publishing. Required products on the Meta app:
    #   - Facebook Login for Business
    #   - Instagram Graph API
    # App must be in Live mode + App Review approval for non-admin users.
    META_CLIENT_ID: str = os.getenv("META_CLIENT_ID", "")
    META_CLIENT_SECRET: str = os.getenv("META_CLIENT_SECRET", "")
    META_REDIRECT_URI: str = os.getenv(
        "META_REDIRECT_URI",
        "http://localhost:8000/api/oauth/meta/callback",
    )
    META_GRAPH_VERSION: str = os.getenv("META_GRAPH_VERSION", "v19.0")
    META_SCOPES: str = os.getenv(
        "META_SCOPES",
        "pages_show_list,pages_read_engagement,pages_manage_posts,"
        "instagram_basic,instagram_content_publish",
    )

    # Google / YouTube OAuth. While the OAuth consent screen is in "Testing"
    # mode in Google Cloud Console, only listed test users can complete it —
    # no verification needed. Up to 100 test users.
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET", "")
    GOOGLE_REDIRECT_URI: str = os.getenv(
        "GOOGLE_REDIRECT_URI",
        "http://localhost:8000/api/oauth/google/callback",
    )
    GOOGLE_SCOPES: str = os.getenv(
        "GOOGLE_SCOPES",
        "openid email profile https://www.googleapis.com/auth/youtube.upload",
    )

    # Where the OAuth callback bounces the browser after success/failure.
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")

    SCHEDULER_ENABLED: bool = os.getenv("SCHEDULER_ENABLED", "1") not in ("0", "false", "False")
    SCHEDULER_INTERVAL_SECONDS: int = int(os.getenv("SCHEDULER_INTERVAL_SECONDS", "30"))

    SENTRY_DSN: str = os.getenv("SENTRY_DSN", "")
    SENTRY_ENV: str = os.getenv("SENTRY_ENV", "dev")
    SENTRY_TRACES_SAMPLE_RATE: float = float(os.getenv("SENTRY_TRACES_SAMPLE_RATE", "0.1"))

    # Storage backend for /api/media. "local" (default) writes to UPLOAD_DIR.
    # "s3" uploads to S3_BUCKET via boto3 — requires AWS creds in env.
    STORAGE_BACKEND: str = os.getenv("STORAGE_BACKEND", "local")
    S3_BUCKET: str = os.getenv("S3_BUCKET", "")
    S3_REGION: str = os.getenv("S3_REGION", "us-east-1")
    S3_PUBLIC_BASE: str = os.getenv("S3_PUBLIC_BASE", "")  # e.g. https://cdn.example.com


settings = Settings()
