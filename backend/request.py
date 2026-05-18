from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

import psycopg2
import os
import json

from werkzeug.utils import secure_filename

app = Flask(__name__)

CORS(app)

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# =========================
# DATABASE
# =========================

conn = psycopg2.connect(
    dbname="repair_app",
    user="postgres",
    password="236043",
    host="localhost",
    port="5432"
)

# =========================
# SUBMIT REQUEST
# =========================

@app.route("/submit", methods=["POST"])
def submit():

    category = request.form.get("category")
    short_desc = request.form.get("short_desc")
    full_desc = request.form.get("full_desc")
    priority = request.form.get("priority")

    dates = request.form.get("dates")

    files = request.files.getlist("photos")

    saved_files = []

    # SAVE FILES
    for file in files:

        if file.filename != "":

            filename = secure_filename(file.filename)

            filepath = os.path.join(
                UPLOAD_FOLDER,
                filename
            )

            counter = 1

            while os.path.exists(filepath):

                filename = f"{counter}_{filename}"

                filepath = os.path.join(
                    UPLOAD_FOLDER,
                    filename
                )

                counter += 1

            file.save(filepath)

            saved_files.append(filename)

    cursor = conn.cursor()

    cursor.execute("""

        INSERT INTO requests (
            category,
            short_desc,
            full_desc,
            priority,
            dates,
            photos,
            status
        )

        VALUES (%s,%s,%s,%s,%s,%s,%s)

    """, (

        category,
        short_desc,
        full_desc,
        priority,
        dates,
        saved_files,
        "Ожидают"

    ))

    conn.commit()

    cursor.close()

    return jsonify({
        "status":"ok"
    })

# =========================
# GET REQUESTS
# =========================

@app.route("/requests", methods=["GET"])
def get_requests():

    cursor = conn.cursor()

    cursor.execute("""

        SELECT
            id,
            category,
            short_desc,
            full_desc,
            priority,
            dates,
            photos,
            status

        FROM requests

        ORDER BY id DESC

    """)

    rows = cursor.fetchall()

    result = []

    for row in rows:

        result.append({

            "id": row[0],
            "category": row[1],
            "short_desc": row[2],
            "full_desc": row[3],
            "priority": row[4],
            "dates": row[5],
            "photos": row[6] or [],
            "status": row[7]

        })

    cursor.close()

    return jsonify(result)

# =========================
# UPDATE STATUS
# =========================

@app.route("/update_status/<int:request_id>", methods=["POST"])
def update_status(request_id):

    data = request.json

    status = data.get("status")

    cursor = conn.cursor()

    cursor.execute("""

        UPDATE requests

        SET status = %s

        WHERE id = %s

    """, (

        status,
        request_id

    ))

    conn.commit()

    cursor.close()

    return jsonify({
        "success":True
    })

# =========================
# GET IMAGE
# =========================

@app.route("/uploads/<filename>")
def uploaded_file(filename):

    return send_from_directory(
        UPLOAD_FOLDER,
        filename
    )

# =========================
# RUN
# =========================

if __name__ == "__main__":

    app.run(debug=True)