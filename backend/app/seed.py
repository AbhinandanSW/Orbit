import random
from datetime import datetime, timedelta
from .db import Base, SessionLocal, engine
from . import models
from .auth import hash_password
from .routers.auth_r import DEFAULT_BRANDS

PLATFORMS = ["instagram", "facebook", "linkedin", "youtube", "threads"]

DEMO_CAPTIONS = [
    "Morning light, slow pours, and a quiet studio. ☕",
    "New drop: Arc & Oak Autumn collection is live.",
    "Behind the scenes of this week's shoot — Verge FW26.",
    "Kinfolk regulars — your loyalty brew just got an upgrade.",
    "Mira Botanics × local farms: our ingredient sourcing story.",
    "3 looks, 1 fabric. Which one lands?",
    "Studio tour — the space where Luma stories are made.",
    "Pro tip from our head of brew: bloom time matters.",
    "New arrivals from the atelier. Limited run.",
    "Customer love: your stories made our week.",
]


def run():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        user = models.User(
            email="demo@orbit.app",
            password_hash=hash_password("demo1234"),
            name="Noor Idris",
            role="Social lead",
            verified=True,
        )
        db.add(user)
        db.flush()

        brands = []
        for b in DEFAULT_BRANDS:
            brand = models.Brand(user_id=user.id, **b)
            db.add(brand)
            brands.append(brand)
        db.flush()

        now = datetime.utcnow()
        random.seed(42)

        # Posts: mix of published (past) and scheduled (future) for each brand
        for brand in brands:
            for i in range(-12, 8):
                when = now + timedelta(days=i, hours=random.randint(7, 20))
                status = "published" if i < 0 else "scheduled"
                plats = random.sample(PLATFORMS, k=random.randint(1, 3))
                db.add(models.Post(
                    brand_id=brand.id,
                    caption=random.choice(DEMO_CAPTIONS),
                    platforms=plats,
                    media_urls=[],
                    scheduled_at=when,
                    published_at=when if status == "published" else None,
                    status=status,
                    engagement=round(random.uniform(1.2, 7.8), 2) if status == "published" else 0.0,
                    reach=random.randint(1200, 28000) if status == "published" else 0,
                ))

        # 90 days of metric samples, 4 per day per brand per platform
        for brand in brands:
            base_reach = random.randint(800, 2500)
            for d in range(90):
                ts_day = now - timedelta(days=89 - d)
                for p in PLATFORMS:
                    plat_mult = {"instagram": 1.4, "facebook": 0.8, "linkedin": 0.5, "youtube": 0.7, "threads": 0.4}[p]
                    for hour in (9, 12, 17, 20):
                        ts = ts_day.replace(hour=hour, minute=0, second=0, microsecond=0)
                        growth = 1 + (d / 120)
                        noise = random.uniform(0.7, 1.3)
                        db.add(models.MetricSample(
                            brand_id=brand.id,
                            platform=p,
                            timestamp=ts,
                            reach=int(base_reach * plat_mult * growth * noise),
                            engagement_rate=round(random.uniform(1.5, 6.5) * plat_mult, 2),
                            saves=random.randint(5, 120),
                            clicks=random.randint(20, 400),
                        ))

        # Seed a couple connections for first brand
        for p in ["instagram", "linkedin"]:
            db.add(models.Connection(brand_id=brands[0].id, platform=p, handle="@lumastudio"))

        db.commit()
        print(f"Seeded user demo@orbit.app / demo1234 with {len(brands)} brands")
    finally:
        db.close()


if __name__ == "__main__":
    run()
