import os
import datetime
import jwt
import bcrypt
from functools import wraps
from flask import request, jsonify
from werkzeug.security import check_password_hash as werkzeug_check_password_hash
from database import get_user_by_email, get_user_by_id, create_user, update_user_profile

SECRET_KEY = os.environ.get("JWT_SECRET", "smartrent_super_secure_jwt_secret_key_2026")
REFRESH_SECRET_KEY = os.environ.get("JWT_REFRESH_SECRET", "smartrent_refresh_secret_key_2026_refresh")


def hash_password(password: str) -> str:
    """Hash a plaintext password using bcrypt."""
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    """Verify a password against a bcrypt or legacy hashed string."""
    if not hashed or not password:
        return False
    try:
        # Check standard bcrypt hashes ($2a$, $2b$, $2y$)
        if hashed.startswith(("$2a$", "$2b$", "$2y$")):
            return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))
        # Fallback to Werkzeug check if legacy hash exists
        return werkzeug_check_password_hash(hashed, password)
    except Exception:
        return False


def generate_token(user_id: int, email: str) -> str:
    """Generates a short-lived access token (15 minutes)."""
    payload = {
        "user_id": user_id,
        "email": email,
        "type": "access",
        "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=15),
        "iat": datetime.datetime.now(datetime.timezone.utc)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


def generate_refresh_token(user_id: int, email: str) -> str:
    """Generates a long-lived refresh token (30 days)."""
    payload = {
        "user_id": user_id,
        "email": email,
        "type": "refresh",
        "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=30),
        "iat": datetime.datetime.now(datetime.timezone.utc)
    }
    return jwt.encode(payload, REFRESH_SECRET_KEY, algorithm="HS256")


def decode_refresh_token(token: str):
    """Decodes and validates a refresh token."""
    try:
        payload = jwt.decode(token, REFRESH_SECRET_KEY, algorithms=["HS256"])
        if payload.get("type") != "refresh":
            return None
        return payload
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None


def decode_token(token: str):
    """Decodes and validates an access token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        if payload.get("type") not in ("access", None):
            return None
        return payload
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None


def get_token_from_header():
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        return auth_header.split(" ", 1)[1].strip()
    return None


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_token_from_header()
        if not token:
            return jsonify({"error": "Authentication token is missing"}), 401

        payload = decode_token(token)
        if not payload:
            return jsonify({"error": "Token is invalid or expired"}), 401

        user = get_user_by_id(payload["user_id"])
        if not user:
            return jsonify({"error": "User not found"}), 404

        request.current_user = user
        return f(*args, **kwargs)
    return decorated


def get_optional_current_user():
    token = get_token_from_header()
    if not token:
        return None
    payload = decode_token(token)
    if not payload:
        return None
    return get_user_by_id(payload.get("user_id"))


def handle_google_login(payload_data):
    """
    Handles Google OAuth token or simulated Google payload.
    Payload can contain:
    - 'credential' (JWT from Google Identity Services)
    - OR direct fields: 'email', 'name', 'google_id', 'avatar_url'
    """
    email = None
    name = "Google User"
    google_id = None
    avatar_url = None

    if "credential" in payload_data and payload_data["credential"]:
        raw_token = payload_data["credential"]
        # 1. Attempt verification with Google's tokeninfo endpoint
        try:
            import urllib.request
            import json
            with urllib.request.urlopen(f"https://oauth2.googleapis.com/tokeninfo?id_token={raw_token}", timeout=5) as resp:
                if resp.status == 200:
                    g_info = json.loads(resp.read().decode("utf-8"))
                    email = g_info.get("email")
                    name = g_info.get("name", "Google User")
                    google_id = g_info.get("sub")
                    avatar_url = g_info.get("picture")
        except Exception:
            pass

        # 2. Fallback: decode JWT payload directly if network request is not available
        if not email:
            try:
                decoded = jwt.decode(raw_token, options={"verify_signature": False})
                email = decoded.get("email")
                name = decoded.get("name", "Google User")
                google_id = decoded.get("sub")
                avatar_url = decoded.get("picture")
            except Exception:
                pass

    if not email:
        email = payload_data.get("email")
        name = payload_data.get("name", "Google User")
        google_id = payload_data.get("google_id") or payload_data.get("sub")
        avatar_url = payload_data.get("avatar_url") or payload_data.get("picture")

    if not email:
        return None, "Invalid Google credentials: email is required"

    # Check if user already exists
    user = get_user_by_email(email)
    if user:
        update_user_profile(
            user["id"],
            google_id=google_id or user.get("google_id"),
            name=name or user.get("name"),
            avatar_url=avatar_url or user.get("avatar_url")
        )
        user = get_user_by_id(user["id"])
    else:
        user = create_user(
            email=email,
            name=name,
            password_hash=None,
            google_id=google_id,
            avatar_url=avatar_url or f"https://api.dicebear.com/7.x/bottts/svg?seed={email}"
        )

    clean_user = dict(user)
    final_avatar = clean_user.get("avatar_url") or avatar_url
    clean_user["avatar_url"] = final_avatar
    clean_user["picture"] = final_avatar

    access_token = generate_token(clean_user["id"], clean_user["email"])
    refresh_token = generate_refresh_token(clean_user["id"], clean_user["email"])
    return {
        "user": clean_user,
        "token": access_token,
        "refresh_token": refresh_token
    }, None
