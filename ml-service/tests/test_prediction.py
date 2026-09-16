import json
try:
    import pytest
except ImportError:
    pytest = None

from app import app
from src.validation import validate_input
from src.preprocessing import create_features
from src.prediction import RentPredictor


def test_validation_missing_field():
    invalid_data = {
        "BHK": 2,
        "Size": 1100
    }
    is_valid, errors = validate_input(invalid_data)
    assert not is_valid
    assert len(errors) > 0


def test_validation_invalid_value():
    invalid_data = {
        "BHK": 0,
        "Size": 1100,
        "Floor": "1 out of 4",
        "Area Type": "Super Area",
        "Area Locality": "Salt Lake City Sector 2",
        "City": "Kolkata",
        "Furnishing Status": "Semi-Furnished",
        "Tenant Preferred": "Bachelors/Family",
        "Bathroom": 2
    }
    is_valid, errors = validate_input(invalid_data)
    assert not is_valid
    assert "BHK must be greater than 0" in errors


def test_predictor_model_load():
    predictor = RentPredictor()
    assert predictor.model is not None


if pytest:
    @pytest.fixture
    def client():
        app.config["TESTING"] = True
        with app.test_client() as client:
            yield client



def test_home_endpoint(client):
    rv = client.get("/")
    assert rv.status_code == 200
    json_data = rv.get_json()
    assert json_data["status"] == "running"


def test_health_endpoint(client):
    rv = client.get("/health")
    assert rv.status_code == 200
    json_data = rv.get_json()
    assert json_data["status"] == "UP"
    assert "model" in json_data


def test_predict_endpoint(client):
    payload = {
        "BHK": 2,
        "Size": 1100,
        "Floor": "1 out of 4",
        "Area Type": "Super Area",
        "Area Locality": "Salt Lake City Sector 2",
        "City": "Kolkata",
        "Furnishing Status": "Semi-Furnished",
        "Tenant Preferred": "Bachelors/Family",
        "Bathroom": 2
    }
    rv = client.post("/predict", data=json.dumps(payload), content_type="application/json")
    assert rv.status_code == 200
    json_data = rv.get_json()
    assert "predicted_rent" in json_data
    assert isinstance(json_data["predicted_rent"], float)
    assert json_data["predicted_rent"] > 0
    assert "model" in json_data
