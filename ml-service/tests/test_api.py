import pytest
import sys
import os
import uuid

# Add ml-service root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app
from database import init_db, User, Prediction, get_db_session


@pytest.fixture
def client():
    app.config["TESTING"] = True
    init_db()
    with app.test_client() as client:
        yield client


def test_health_check(client):
    res = client.get("/health")
    assert res.status_code == 200
    data = res.get_json()
    assert data["status"] == "UP"


def test_sqlalchemy_tables_created():
    init_db()
    with get_db_session() as session:
        # Verify query on User and Prediction SQLAlchemy models
        user_count = session.query(User).count()
        pred_count = session.query(Prediction).count()
        assert isinstance(user_count, int)
        assert isinstance(pred_count, int)


def test_auth_and_prediction_flow(client):
    unique_email = f"user_{uuid.uuid4().hex[:8]}@example.com"
    raw_password = "strongpassword123"

    # 1. Register with bcrypt hashing
    reg = client.post("/api/auth/register", json={
        "email": unique_email,
        "name": "Integration User",
        "password": raw_password
    })
    assert reg.status_code == 201
    reg_data = reg.get_json()
    assert "token" in reg_data
    assert "refresh_token" in reg_data
    token = reg_data["token"]
    user_id = reg_data["user"]["id"]

    # Verify password hash in db is bcrypt
    with get_db_session() as session:
        db_user = session.query(User).filter(User.id == user_id).first()
        assert db_user is not None
        assert db_user.password_hash.startswith(("$2a$", "$2b$", "$2y$"))

    # 2. Login with correct password
    login_res = client.post("/api/auth/login", json={
        "email": unique_email,
        "password": raw_password
    })
    assert login_res.status_code == 200
    login_data = login_res.get_json()
    assert "token" in login_data

    # 3. Login with wrong password
    bad_login = client.post("/api/auth/login", json={
        "email": unique_email,
        "password": "wrongpassword"
    })
    assert bad_login.status_code == 401

    # 4. Predict with auth token -> saves to smartrent.db
    pred_res = client.post("/api/predict", headers={"Authorization": f"Bearer {token}"}, json={
        "BHK": 2,
        "Size": 950,
        "City": "Bangalore",
        "Floor": "2 out of 4",
        "Area Type": "Carpet Area",
        "Area Locality": "Electronic City",
        "Furnishing Status": "Semi-Furnished",
        "Tenant Preferred": "Bachelors/Family",
        "Bathroom": 2
    })
    assert pred_res.status_code == 200
    pred_data = pred_res.get_json()
    assert "predicted_rent" in pred_data
    assert pred_data["predicted_rent"] > 0
    assert "saved_id" in pred_data
    assert pred_data["saved_id"] is not None
    saved_id = pred_data["saved_id"]

    # Verify prediction record exists in smartrent.db via SQLAlchemy
    with get_db_session() as session:
        saved_pred = session.query(Prediction).filter(Prediction.id == saved_id).first()
        assert saved_pred is not None
        assert saved_pred.user_id == user_id
        assert saved_pred.city == "Bangalore"
        assert saved_pred.bhk == 2
        assert saved_pred.size == 950
        assert saved_pred.furnishing == "Semi-Furnished"
        assert saved_pred.rent > 0

    # 5. Check prediction history
    hist = client.get("/api/predictions", headers={"Authorization": f"Bearer {token}"})
    assert hist.status_code == 200
    hist_data = hist.get_json()
    assert hist_data["count"] >= 1
    assert any(p["id"] == saved_id for p in hist_data["predictions"])

    # 6. Check dashboard stats
    stats = client.get("/api/dashboard/stats", headers={"Authorization": f"Bearer {token}"})
    assert stats.status_code == 200
    stats_data = stats.get_json()
    assert stats_data["stats"]["total_predictions"] >= 1


def test_google_auth(client):
    email = f"google_{uuid.uuid4().hex[:8]}@gmail.com"
    res = client.post("/api/auth/google", json={
        "email": email,
        "name": "Google Tester",
        "avatar_url": "https://example.com/photo.jpg"
    })
    assert res.status_code == 200
    data = res.get_json()
    assert "token" in data
    assert data["user"]["email"] == email


def test_analytics_with_realtime_db(client):
    res = client.get("/api/analytics")
    assert res.status_code == 200
    data = res.get_json()
    assert "summary" in data
    assert "by_city" in data
    assert "db_realtime_records" in data["summary"]

    loc_res = client.get("/api/localities")
    assert loc_res.status_code == 200
    assert "Mumbai" in loc_res.get_json()
