import os
from datetime import datetime, timezone
from contextlib import contextmanager

from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Float,
    DateTime,
    ForeignKey,
    func,
    desc
)
from sqlalchemy.orm import (
    declarative_base,
    relationship,
    sessionmaker,
    scoped_session
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "smartrent.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionFactory = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
ScopedSession = scoped_session(SessionFactory)
Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(120), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=True)
    google_id = Column(String(120), nullable=True)
    avatar_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    predictions = relationship(
        "Prediction",
        back_populates="user",
        cascade="all, delete-orphan",
        passive_deletes=True
    )

    def to_dict(self, include_sensitive=False):
        data = {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "google_id": self.google_id,
            "avatar_url": self.avatar_url,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
        if include_sensitive:
            data["password_hash"] = self.password_hash
        return data


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    rent = Column(Float, nullable=False)
    city = Column(String(80), nullable=False, index=True)
    bhk = Column(Float, nullable=False)
    size = Column(Float, nullable=False)
    furnishing = Column(String(80), nullable=False)
    floor = Column(String(80), default="1 out of 2")
    area_type = Column(String(80), default="Super Area")
    area_locality = Column(String(120), default="")
    tenant_preferred = Column(String(80), default="Bachelors/Family")
    bathroom = Column(Float, default=1.0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationship
    user = relationship("User", back_populates="predictions")

    @property
    def predicted_rent(self):
        return self.rent

    @property
    def furnishing_status(self):
        return self.furnishing

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "rent": self.rent,
            "predicted_rent": self.rent,
            "city": self.city,
            "bhk": self.bhk,
            "size": self.size,
            "furnishing": self.furnishing,
            "furnishing_status": self.furnishing,
            "floor": self.floor,
            "area_type": self.area_type,
            "area_locality": self.area_locality,
            "tenant_preferred": self.tenant_preferred,
            "bathroom": self.bathroom,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


@contextmanager
def get_db_session():
    """Provides a transactional scope around a series of operations."""
    session = ScopedSession()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def init_db():
    """Create tables if they do not exist, and ensure schema has all required columns."""
    import sqlite3
    if os.path.exists(DB_PATH):
        try:
            conn = sqlite3.connect(DB_PATH)
            c = conn.cursor()
            # Check predictions table columns
            c.execute("PRAGMA table_info(predictions)")
            cols = [row[1] for row in c.fetchall()]
            if cols and ("predicted_rent" in cols or "furnishing_status" in cols):
                c.execute("""
                    CREATE TABLE IF NOT EXISTS predictions_v2 (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER,
                        rent REAL NOT NULL,
                        city TEXT NOT NULL,
                        bhk REAL NOT NULL,
                        size REAL NOT NULL,
                        furnishing TEXT NOT NULL,
                        floor TEXT DEFAULT '1 out of 2',
                        area_type TEXT DEFAULT 'Super Area',
                        area_locality TEXT DEFAULT '',
                        tenant_preferred TEXT DEFAULT 'Bachelors/Family',
                        bathroom REAL DEFAULT 1.0,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
                    )
                """)
                rent_col = "COALESCE(rent, predicted_rent, 0)" if "rent" in cols else "predicted_rent"
                furn_col = "COALESCE(furnishing, furnishing_status, 'Semi-Furnished')" if "furnishing" in cols else "furnishing_status"
                c.execute(f"""
                    INSERT INTO predictions_v2 (id, user_id, rent, city, bhk, size, furnishing, floor, area_type, area_locality, tenant_preferred, bathroom, created_at)
                    SELECT id, user_id, {rent_col}, city, bhk, size, {furn_col}, floor, area_type, area_locality, tenant_preferred, bathroom, created_at
                    FROM predictions
                """)
                c.execute("DROP TABLE predictions")
                c.execute("ALTER TABLE predictions_v2 RENAME TO predictions")
                conn.commit()
            conn.close()
        except Exception as e:
            print(f"Warning migrating database: {e}")

    Base.metadata.create_all(bind=engine)



def create_user(email, name, password_hash=None, google_id=None, avatar_url=None):
    with get_db_session() as session:
        existing = session.query(User).filter(func.lower(User.email) == email.lower().strip()).first()
        if existing:
            return None
        user = User(
            email=email.lower().strip(),
            name=name.strip(),
            password_hash=password_hash,
            google_id=google_id,
            avatar_url=avatar_url
        )
        session.add(user)
        session.flush()
        return user.to_dict()


def get_user_by_email(email):
    with get_db_session() as session:
        user = session.query(User).filter(func.lower(User.email) == email.lower().strip()).first()
        return user.to_dict(include_sensitive=True) if user else None


def get_user_by_id(user_id):
    with get_db_session() as session:
        user = session.query(User).filter(User.id == user_id).first()
        return user.to_dict() if user else None


def update_user_profile(user_id, **kwargs):
    with get_db_session() as session:
        user = session.query(User).filter(User.id == user_id).first()
        if not user:
            return None
        for k, v in kwargs.items():
            if v is not None and hasattr(user, k):
                setattr(user, k, v)
        session.flush()
        return user.to_dict()


def save_prediction(user_id, data, predicted_rent):
    with get_db_session() as session:
        furnishing = str(data.get("Furnishing Status") or data.get("furnishing") or "Semi-Furnished")
        pred = Prediction(
            user_id=user_id,
            rent=float(predicted_rent),
            city=str(data.get("City", "Unknown")),
            bhk=float(data.get("BHK", 1)),
            size=float(data.get("Size", 500)),
            furnishing=furnishing,
            floor=str(data.get("Floor", "1 out of 2")),
            area_type=str(data.get("Area Type", "Super Area")),
            area_locality=str(data.get("Area Locality", "")),
            tenant_preferred=str(data.get("Tenant Preferred", "Bachelors/Family")),
            bathroom=float(data.get("Bathroom", 1))
        )
        session.add(pred)
        session.flush()
        return pred.id


def get_user_predictions(user_id, limit=50):
    with get_db_session() as session:
        preds = (
            session.query(Prediction)
            .filter(Prediction.user_id == user_id)
            .order_by(desc(Prediction.created_at))
            .limit(limit)
            .all()
        )
        return [p.to_dict() for p in preds]


def delete_prediction(prediction_id, user_id):
    with get_db_session() as session:
        pred = session.query(Prediction).filter(
            Prediction.id == prediction_id,
            Prediction.user_id == user_id
        ).first()
        if pred:
            session.delete(pred)
            return True
        return False


def get_dashboard_stats(user_id):
    with get_db_session() as session:
        # User stats
        user_agg = (
            session.query(
                func.count(Prediction.id).label("total"),
                func.avg(Prediction.rent).label("avg_rent"),
                func.min(Prediction.rent).label("min_rent"),
                func.max(Prediction.rent).label("max_rent")
            )
            .filter(Prediction.user_id == user_id)
            .first()
        )

        total_predictions = user_agg.total or 0
        avg_rent = round(float(user_agg.avg_rent or 0), 2)
        min_rent = round(float(user_agg.min_rent or 0), 2)
        max_rent = round(float(user_agg.max_rent or 0), 2)

        # Top city evaluated by user
        top_city_res = (
            session.query(Prediction.city, func.count(Prediction.id).label("city_count"))
            .filter(Prediction.user_id == user_id)
            .group_by(Prediction.city)
            .order_by(desc("city_count"))
            .first()
        )
        top_city = top_city_res[0] if top_city_res else "N/A"

        # Global predictions count
        global_count = session.query(func.count(Prediction.id)).scalar() or 0

        return {
            "total_predictions": total_predictions,
            "avg_predicted_rent": avg_rent,
            "min_predicted_rent": min_rent,
            "max_predicted_rent": max_rent,
            "top_city": top_city,
            "global_predictions_count": global_count
        }


def get_all_db_predictions():
    """Retrieve all predictions from smartrent.db as list of dicts."""
    with get_db_session() as session:
        records = session.query(Prediction).all()
        return [r.to_dict() for r in records]
