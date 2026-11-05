
import hmac
import os
import sqlite3
from contextlib import contextmanager
from pathlib import Path

import psycopg
from dotenv import load_dotenv
from flask import Flask, jsonify, request, session
from flask_cors import CORS
from psycopg.rows import dict_row

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

IS_PRODUCTION = os.getenv("APP_ENV", "development").lower() == "production"
DATABASE_URL = os.getenv("DATABASE_URL", "").strip()

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

SECRET_KEY = os.getenv("SECRET_KEY")

if not SECRET_KEY:
    if IS_PRODUCTION:
        raise RuntimeError("SECRET_KEY must be set in production.")
    SECRET_KEY = "local-development-only-change-this-key"


def create_app():
    app = Flask(__name__)
    app.secret_key = SECRET_KEY

    app.config["MAX_CONTENT_LENGTH"] = 16 * 1024

    default_origins = "http://127.0.0.1:5500,http://localhost:5500"

    allowed_origins = [
        origin.strip()
        for origin in os.getenv(
            "ALLOWED_ORIGINS", default_origins
        ).split(",")
        if origin.strip()
    ]

    app.config.update(
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE="None" if IS_PRODUCTION else "Lax",
        SESSION_COOKIE_SECURE=IS_PRODUCTION,
        PERMANENT_SESSION_LIFETIME=60 * 60 * 8,
    )

    CORS(
        app,
        resources={r"/api/*": {"origins": allowed_origins}},
        supports_credentials=True,
    )

    if DATABASE_URL:
        use_postgres = True
        database_path = None
    else:
        use_postgres = False
        database_path = BASE_DIR / "instance" / "neuraflow.db"
        database_path.parent.mkdir(parents=True, exist_ok=True)

    @contextmanager
    def get_db():
        if use_postgres:
            with psycopg.connect(
                DATABASE_URL, row_factory=dict_row
            ) as connection:
                yield connection
        else:
            connection = sqlite3.connect(str(database_path))
            connection.row_factory = sqlite3.Row
            try:
                yield connection
                connection.commit()
            except Exception:
                connection.rollback()
                raise
            finally:
                connection.close()

    def execute(connection, sql, parameters=()):
        if use_postgres:
            sql = sql.replace("?", "%s")
        return connection.execute(sql, parameters)

    def initialize_database():
        if use_postgres:
            create_table_sql = """
                CREATE TABLE IF NOT EXISTS enquiries (
                    id BIGSERIAL PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    email VARCHAR(120) NOT NULL,
                    message TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """
        else:
            create_table_sql = """
                CREATE TABLE IF NOT EXISTS enquiries (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL,
                    message TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """

        with get_db() as connection:
            connection.execute(create_table_sql)

    initialize_database()

    def admin_required():
        if not session.get("is_admin"):
            return jsonify({
                "status": "error",
                "success": False,
                "message": "Admin login required."
            }), 401
        return None

    @app.after_request
    def add_security_headers(response):
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = (
            "strict-origin-when-cross-origin"
        )
        return response

    @app.route("/api/health", methods=["GET"])
    def health():
        try:
            with get_db() as connection:
                connection.execute("SELECT 1")

            return jsonify({
                "status": "success",
                "message": "NeuraFlow AI backend is running!",
                "database": "connected"
            }), 200

        except Exception:
            app.logger.exception("Health check database failure")
            return jsonify({
                "status": "error",
                "message": "Backend is running but database is unavailable."
            }), 503

    # Public endpoint: save an enquiry.
    @app.route("/api/enquiries", methods=["POST"])
    def create_enquiry():
        data = request.get_json(silent=True) or {}

        name = str(data.get("name", "")).strip()
        email = str(data.get("email", "")).strip()
        message = str(data.get("message", "")).strip()

        if not name or not email or not message:
            return jsonify({
                "status": "error",
                "message": "All fields are required."
            }), 400

        if (
            len(name) > 100
            or len(email) > 120
            or len(message) > 5000
        ):
            return jsonify({
                "status": "error",
                "message": "One or more fields exceed the allowed length."
            }), 400

        if "@" not in email or email.startswith("@") or email.endswith("@"):
            return jsonify({
                "status": "error",
                "message": "Please enter a valid email address."
            }), 400

        try:
            with get_db() as connection:
                execute(
                    connection,
                    """
                    INSERT INTO enquiries (name, email, message)
                    VALUES (?, ?, ?)
                    """,
                    (name, email, message),
                )

            # FUTURE EMAIL INTEGRATION:
            # Add your email provider code here after configuring
            # its credentials as hosting environment variables.

            return jsonify({
                "status": "success",
                "message": "Thank you! Your enquiry has been received."
            }), 201

        except Exception:
            app.logger.exception("Unable to save enquiry")
            return jsonify({
                "status": "error",
                "message": "Unable to save your enquiry."
            }), 500

    # Protected endpoint: retrieve enquiries.
    @app.route("/api/enquiries", methods=["GET"])
    def get_enquiries():
        auth_error = admin_required()
        if auth_error:
            return auth_error

        try:
            with get_db() as connection:
                rows = execute(
                    connection,
                    """
                    SELECT id, name, email, message, created_at
                    FROM enquiries
                    ORDER BY id DESC
                    """
                ).fetchall()

            enquiries = []

            for row in rows:
                item = dict(row)

                if item.get("created_at") is not None:
                    item["created_at"] = str(item["created_at"])

                enquiries.append(item)

            return jsonify({
                "status": "success",
                "enquiries": enquiries
            }), 200

        except Exception:
            app.logger.exception("Unable to retrieve enquiries")
            return jsonify({
                "status": "error",
                "message": "Unable to retrieve enquiries."
            }), 500

    # Protected endpoint: delete an enquiry.
    @app.route("/api/enquiries/<int:enquiry_id>", methods=["DELETE"])
    def delete_enquiry(enquiry_id):
        auth_error = admin_required()
        if auth_error:
            return auth_error

        try:
            with get_db() as connection:
                cursor = execute(
                    connection,
                    "DELETE FROM enquiries WHERE id = ?",
                    (enquiry_id,),
                )

                if cursor.rowcount == 0:
                    return jsonify({
                        "status": "error",
                        "message": "Enquiry not found."
                    }), 404

            return jsonify({
                "status": "success",
                "message": "Enquiry deleted successfully."
            }), 200

        except Exception:
            app.logger.exception("Unable to delete enquiry")
            return jsonify({
                "status": "error",
                "message": "Unable to delete enquiry."
            }), 500

    # Admin login.
    @app.route("/api/admin/login", methods=["POST"])
    def admin_login():
        data = request.get_json(silent=True) or {}

        password = data.get("password", "")
        admin_password = os.getenv("ADMIN_PASSWORD", "")

        if not isinstance(password, str) or not admin_password:
            return jsonify({
                "success": False,
                "message": "Admin password is not configured or login data is invalid."
            }), 500

        if not hmac.compare_digest(password, admin_password):
            return jsonify({
                "success": False,
                "message": "Incorrect password."
            }), 401

        session.clear()
        session["is_admin"] = True

        return jsonify({
            "success": True,
            "message": "Login successful."
        }), 200

    # Admin logout.
    @app.route("/api/admin/logout", methods=["POST"])
    def admin_logout():
        session.clear()

        return jsonify({
            "success": True,
            "message": "Logged out successfully."
        }), 200

    # Check admin session.
    @app.route("/api/admin/status", methods=["GET"])
    def admin_status():
        return jsonify({
            "logged_in": bool(session.get("is_admin"))
        }), 200

    return app


app = create_app()


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=int(os.getenv("PORT", "5000")),
        debug=not IS_PRODUCTION,
    )
