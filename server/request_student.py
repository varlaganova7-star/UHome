from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import psycopg2
import os
from werkzeug.utils import secure_filename
import json

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

conn = psycopg2.connect(
    dbname="repair_app",
    user="postgres",
    password="236043",
    host="localhost",
    port="5432"
)

@app.route("/submit", methods=["POST"])
def submit():
    category = request.form.get("category")
    short_desc = request.form.get("short_desc")
    full_desc = request.form.get("full_desc")
    priority = request.form.get("priority")
    dates = request.form.get("dates")

    files = request.files.getlist("photos")
    saved_files = []

    for file in files:
        if file.filename != "":
            filename = secure_filename(file.filename)

            # чтобы не перезаписывались
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            counter = 1
            while os.path.exists(filepath):
                filename = f"{counter}_{filename}"
                filepath = os.path.join(UPLOAD_FOLDER, filename)
                counter += 1

            file.save(filepath)
            saved_files.append(filename)

    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO requests (category, short_desc, full_desc, priority, dates, photos)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (
        category,
        short_desc,
        full_desc,
        priority,
        dates,
        saved_files
    ))

    conn.commit()
    cursor.close()

    return jsonify({"status": "ok"})


# 👉 чтобы можно было открывать фото в браузере
@app.route("/uploads/<filename>")
def get_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


if __name__ == "__main__":
    app.run(debug=True)