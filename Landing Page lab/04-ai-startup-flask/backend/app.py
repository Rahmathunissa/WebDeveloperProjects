
import os
import sqlite3

from flask import Flask, jsonify, request
from flask_cors import CORS

from config import Config


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": [
                    "http://127.0.0.1:5500",
                    "http://localhost:5500"
                ]
            }
        }
    )

    DATABASE = os.path.join(app.instance_path, "neuraflow.db")
    os.makedirs(app.instance_path, exist_ok=True)

    def initialize_database():
        connection = sqlite3.connect(DATABASE)
        connection.execute("""
            CREATE TABLE IF NOT EXISTS enquiries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        connection.commit()
        connection.close()

    initialize_database()

    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({
            "status": "success",
            "message": "NeuraFlow AI backend is running!"
        }), 200

    # Save enquiry
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

        if len(name) > 100 or len(email) > 120:
            return jsonify({
                "status": "error",
                "message": "Name or email is too long."
            }), 400

        if "@" not in email:
            return jsonify({
                "status": "error",
                "message": "Please enter a valid email address."
            }), 400

        try:
            with sqlite3.connect(DATABASE) as connection:
                connection.execute(
                    """
                    INSERT INTO enquiries (name, email, message)
                    VALUES (?, ?, ?)
                    """,
                    (name, email, message)
                )

            # FUTURE EMAIL INTEGRATION:
            # Add email provider code here when configured.

            return jsonify({
                "status": "success",
                "message": "Thank you! Your enquiry has been received."
            }), 201

        except sqlite3.Error:
            return jsonify({
                "status": "error",
                "message": "Unable to save your enquiry."
            }), 500

    # Retrieve enquiries
    @app.route("/api/enquiries", methods=["GET"])
    def get_enquiries():
        try:
            with sqlite3.connect(DATABASE) as connection:
                connection.row_factory = sqlite3.Row

                enquiries = connection.execute("""
                    SELECT id, name, email, message, created_at
                    FROM enquiries
                    ORDER BY id DESC
                """).fetchall()

            return jsonify({
                "status": "success",
                "enquiries": [dict(row) for row in enquiries]
            }), 200

        except sqlite3.Error:
            return jsonify({
                "status": "error",
                "message": "Unable to retrieve enquiries."
            }), 500
    # Delete an enquiry
    @app.route("/api/enquiries/<int:enquiry_id>", methods=["DELETE"])
    def delete_enquiry(enquiry_id):
        try:
            with sqlite3.connect(DATABASE) as connection:
                cursor = connection.execute(
                    "DELETE FROM enquiries WHERE id = ?",
                    (enquiry_id,)
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

        except sqlite3.Error:
            return jsonify({
                "status": "error",
                "message": "Unable to delete enquiry."
            }), 500
    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
