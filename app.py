import os
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS

from database import (
    init_db,
    create_user,
    get_user_by_email,
    get_user_by_id,
    save_prediction,
    get_user_predictions,
    delete_prediction,
    get_dashboard_stats
)
from auth import (
    hash_password,
    verify_password,
    generate_token,
    generate_refresh_token,
    decode_refresh_token,
    token_required,
    get_optional_current_user,
    handle_google_login
)
from analytics import get_analytics, get_city_localities
from src.preprocessing import create_features
from src.validation import validate_input
from src.prediction import RentPredictor

app = Flask(__name__)
# Enable CORS for all routes and origins
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Initialize SQLite database using SQLAlchemy
init_db()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "best_model.pkl")
METADATA_PATH = os.path.join(BASE_DIR, "model", "model_metadata.pkl")

# Load predictor and metadata
predictor = RentPredictor(MODEL_PATH)
try:
    metadata = joblib.load(METADATA_PATH)
except Exception:
    metadata = {"model_name": "Extra Trees (LogTarget)", "target": "Rent"}


# ---------------------------------------------------------
# Health & Status
# ---------------------------------------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "service": "SmartRent Backend API",
        "version": "2.0.0",
        "status": "running",
        "endpoints": [
            "/health",
            "/api/auth/register",
            "/api/auth/login",
            "/api/auth/google",
            "/api/auth/refresh",
            "/api/auth/me",
            "/api/predict",
            "/api/predictions",
            "/api/dashboard/stats",
            "/api/analytics",
            "/api/localities",
            "/api/model/info"
        ]
    })


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "UP",
        "model": metadata.get("model_name", "Extra Trees (LogTarget)")
    })


# ---------------------------------------------------------
# Authentication Endpoints
# ---------------------------------------------------------
@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    name = data.get("name", "").strip()
    password = data.get("password", "")

    if not email or "@" not in email:
        return jsonify({"error": "A valid email address is required"}), 400
    if not name:
        return jsonify({"error": "Full name is required"}), 400
    if not password or len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    existing = get_user_by_email(email)
    if existing:
        return jsonify({"error": "An account with this email already exists"}), 409

    pwd_hash = hash_password(password)
    avatar = f"https://api.dicebear.com/7.x/bottts/svg?seed={email}"
    user = create_user(email=email, name=name, password_hash=pwd_hash, avatar_url=avatar)

    if not user:
        return jsonify({"error": "Failed to create user account"}), 500

    access_token = generate_token(user["id"], user["email"])
    refresh_token = generate_refresh_token(user["id"], user["email"])
    return jsonify({
        "message": "Registration successful",
        "token": access_token,
        "refresh_token": refresh_token,
        "user": user
    }), 201


@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = get_user_by_email(email)
    if not user or not user.get("password_hash"):
        return jsonify({"error": "Invalid email or password"}), 401

    if not verify_password(password, user["password_hash"]):
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = generate_token(user["id"], user["email"])
    refresh_token = generate_refresh_token(user["id"], user["email"])
    clean_user = {
        "id": user["id"],
        "email": user["email"],
        "name": user["name"],
        "avatar_url": user.get("avatar_url"),
        "created_at": user.get("created_at")
    }

    return jsonify({
        "message": "Login successful",
        "token": access_token,
        "refresh_token": refresh_token,
        "user": clean_user
    })


@app.route("/api/auth/google", methods=["POST"])
def google_auth():
    data = request.get_json() or {}
    result, error = handle_google_login(data)
    if error:
        return jsonify({"error": error}), 400

    return jsonify({
        "message": "Google authentication successful",
        "token": result["token"],
        "refresh_token": result["refresh_token"],
        "user": result["user"]
    })


@app.route("/api/auth/refresh", methods=["POST"])
def refresh_token_endpoint():
    """Exchange a valid refresh token for a new access token."""
    data = request.get_json() or {}
    refresh_token = data.get("refresh_token", "")

    if not refresh_token:
        return jsonify({"error": "Refresh token is required"}), 400

    payload = decode_refresh_token(refresh_token)
    if not payload:
        return jsonify({"error": "Refresh token is invalid or expired"}), 401

    user = get_user_by_id(payload["user_id"])
    if not user:
        return jsonify({"error": "User not found"}), 404

    new_access_token = generate_token(user["id"], user["email"])
    return jsonify({
        "token": new_access_token
    })


@app.route("/api/auth/me", methods=["GET"])
@token_required
def get_me():
    user = request.current_user
    return jsonify({
        "user": user
    })


# ---------------------------------------------------------
# ML Prediction Endpoint
# ---------------------------------------------------------
@app.route("/predict", methods=["POST"])
@app.route("/api/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No input JSON data provided"}), 400

        # Handle Area Locality default if omitted
        if "Area Locality" not in data or not str(data.get("Area Locality")).strip():
            city = data.get("City", "Kolkata")
            locs = get_city_localities().get(city, [])
            data["Area Locality"] = locs[0] if locs else city

        # Validate input
        is_valid, errors = validate_input(data)
        if not is_valid:
            return jsonify({
                "error": "Validation Error",
                "details": errors
            }), 400

        # Feature Engineering
        input_df = create_features(data)

        # Make Prediction
        raw_pred = predictor.predict(input_df)
        predicted_rent = max(1000.0, round(float(raw_pred), 2))

        # Additional insights
        size = float(data.get("Size", 1))
        price_per_sqft = round(predicted_rent / size, 2)
        rent_range = {
            "low": round(predicted_rent * 0.93, 2),
            "high": round(predicted_rent * 1.07, 2)
        }

        # Compare with City average
        analytics_data = get_analytics()
        city_avg = None
        for item in analytics_data.get("by_city", []):
            if item["city"].lower() == str(data.get("City", "")).lower():
                city_avg = item["avg_rent"]
                break

        city_comparison = None
        if city_avg:
            diff_pct = round(((predicted_rent - city_avg) / city_avg) * 100, 1)
            city_comparison = {
                "city_average": city_avg,
                "difference_pct": diff_pct,
                "label": f"{abs(diff_pct)}% {'above' if diff_pct > 0 else 'below'} {data.get('City')} average"
            }

        # Save to SQLite database via SQLAlchemy if user is authenticated
        current_user = get_optional_current_user()
        saved_id = None
        if current_user:
            saved_id = save_prediction(current_user["id"], data, predicted_rent)

        return jsonify({
            "predicted_rent": predicted_rent,
            "formatted_rent": f"₹ {predicted_rent:,.0f}",
            "currency": "INR",
            "price_per_sqft": price_per_sqft,
            "rent_range": rent_range,
            "city_comparison": city_comparison,
            "saved_id": saved_id,
            "model": metadata.get("model_name", "Extra Trees (LogTarget)")
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 400


# ---------------------------------------------------------
# User Dashboard & History
# ---------------------------------------------------------
@app.route("/api/predictions", methods=["GET"])
@token_required
def list_predictions():
    user = request.current_user
    limit = request.args.get("limit", 50, type=int)
    predictions = get_user_predictions(user["id"], limit=limit)
    return jsonify({
        "predictions": predictions,
        "count": len(predictions)
    })


@app.route("/api/predictions/<int:prediction_id>", methods=["DELETE"])
@token_required
def remove_prediction(prediction_id):
    user = request.current_user
    success = delete_prediction(prediction_id, user["id"])
    if not success:
        return jsonify({"error": "Prediction not found or unauthorized"}), 404
    return jsonify({"message": "Prediction deleted successfully"})


@app.route("/api/dashboard/stats", methods=["GET"])
@token_required
def dashboard_stats():
    user = request.current_user
    stats = get_dashboard_stats(user["id"])
    return jsonify({
        "user_id": user["id"],
        "user_name": user["name"],
        "stats": stats
    })


# ---------------------------------------------------------
# Market Analytics & Localities
# ---------------------------------------------------------
@app.route("/api/analytics", methods=["GET"])
def analytics_endpoint():
    city = request.args.get("city", None)
    bhk_param = request.args.get("bhk", None)
    bhk = None
    if bhk_param and bhk_param != "All":
        digits = "".join([c for c in bhk_param if c.isdigit()])
        if digits:
            bhk = int(digits)
    data = get_analytics(city=city, bhk=bhk)
    return jsonify(data)


@app.route("/api/localities", methods=["GET"])
def localities_endpoint():
    localities = get_city_localities()
    return jsonify(localities)


@app.route("/api/model/info", methods=["GET"])
def model_info_endpoint():
    data = get_analytics()
    return jsonify({
        "model_metadata": metadata,
        "analytics_model_info": data.get("model_info", {})
    })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
