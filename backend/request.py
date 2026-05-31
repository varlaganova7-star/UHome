from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor, Json
import os
import json
from werkzeug.utils import secure_filename
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # Разрешаем запросы с любого источника (для разработки)

# ================= КОНФИГУРАЦИЯ =================
UPLOAD_FOLDER = "backend/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ================= БАЗА ДАННЫХ =================
def get_db_connection():
    return psycopg2.connect(
        dbname=os.getenv("DB_NAME", "repair_app"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", "236043"),
        host=os.getenv("DB_HOST", "127.0.0.1"),  # ← IPv4 вместо localhost
        port=os.getenv("DB_PORT", "5432"),
        cursor_factory=RealDictCursor
    )

# ================= ПОДАЧА ЗАЯВКИ =================
@app.route("/api/requests", methods=["POST"])
def submit_request():
    try:
        # Данные формы
        student_name = request.form.get("student_name", "Неизвестный")
        student_role = request.form.get("student_role", "student")
        room_number = request.form.get("room_number", "")
        category = request.form.get("category")
        short_desc = request.form.get("short_desc")
        full_desc = request.form.get("full_desc", "")
        priority = request.form.get("priority", "normal")
        preferred_dates = request.form.get("dates", "[]")
        
        # Валидация
        if not category or not short_desc:
            return jsonify({"error": "Категория и краткое описание обязательны"}), 400
        
        # Обработка фото
        files = request.files.getlist("photos")
        saved_files = []
        
        for file in files:
            if file and file.filename != "" and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                # Уникальное имя: timestamp_оригинал
                unique_name = f"{int(datetime.now().timestamp())}_{filename}"
                filepath = os.path.join(UPLOAD_FOLDER, unique_name)
                file.save(filepath)
                saved_files.append(unique_name)
        
        # Парсим даты
        try:
            dates_list = json.loads(preferred_dates) if preferred_dates != "[]" else []
        except:
            dates_list = []
        
        # Сохраняем в БД
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO requests (
                student_name, student_role, room_number, category, 
                short_desc, full_desc, priority, preferred_dates, 
                photos, status
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, created_at
        """, (
            student_name, student_role, room_number, category,
            short_desc, full_desc, priority, Json(dates_list),
            Json(saved_files), "Ожидают"
        ))
        
        new_request = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({
            "success": True,
            "message": "✅ Заявка успешно подана!",
            "request_id": new_request["id"],
            "created_at": new_request["created_at"].isoformat()
        }), 201
        
    except Exception as e:
        print(f"❌ Ошибка подачи заявки: {e}")
        return jsonify({"error": "Внутренняя ошибка сервера"}), 500

# ================= ПОЛУЧЕНИЕ ЗАЯВОК =================
@app.route("/api/requests", methods=["GET"])
def get_requests():
    try:
        role = request.args.get("role", "student")
        student_name = request.args.get("student_name")  # Для фильтрации своих заявок
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if role == "admin" or role == "master":
            # Админ/мастер видит ВСЕ заявки
            cursor.execute("""
                SELECT id, student_name, student_role, room_number, category, 
                       short_desc, full_desc, priority, preferred_dates, 
                       photos, status, master_assigned, created_at, updated_at
                FROM requests
                ORDER BY created_at DESC
                LIMIT 100
            """)
        else:
            # Студент видит только СВОИ заявки
            cursor.execute("""
                SELECT id, student_name, student_role, room_number, category, 
                       short_desc, full_desc, priority, preferred_dates, 
                       photos, status, master_assigned, created_at, updated_at
                FROM requests
                WHERE student_name = %s OR student_role != 'student'
                ORDER BY created_at DESC
                LIMIT 100
            """, (student_name,))
        
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        
        # Форматируем ответ
        result = []
        for row in rows:
            result.append({
                "id": row["id"],
                "student_name": row["student_name"],
                "student_role": row["student_role"],
                "room_number": row["room_number"],
                "category": row["category"],
                "short_desc": row["short_desc"],
                "full_desc": row["full_desc"],
                "priority": row["priority"],
                "preferred_dates": row["preferred_dates"] or [],
                "photos": [f"/api/uploads/{f}" for f in (row["photos"] or [])],
                "status": row["status"],
                "master_assigned": row["master_assigned"],
                "created_at": row["created_at"].isoformat() if row["created_at"] else None,
                "updated_at": row["updated_at"].isoformat() if row["updated_at"] else None
            })
        
        return jsonify(result)
        
    except Exception as e:
        print(f"❌ Ошибка получения заявок: {e}")
        return jsonify({"error": "Внутренняя ошибка сервера"}), 500

# ================= ОБНОВЛЕНИЕ СТАТУСА =================
@app.route("/api/requests/<int:request_id>/status", methods=["PATCH"])
def update_status(request_id):
    try:
        data = request.get_json()
        new_status = data.get("status")
        changed_by = data.get("changed_by", "Система")
        comment = data.get("comment", "")
        
        # Валидация статуса
        valid_statuses = ["Ожидают", "В работе", "Выполнено", "Отклонено", "Отменено"]
        if new_status not in valid_statuses:
            return jsonify({"error": f"Неверный статус. Допустимые: {valid_statuses}"}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Получаем текущий статус для истории
        cursor.execute("SELECT status FROM requests WHERE id = %s", (request_id,))
        row = cursor.fetchone()
        if not row:
            cursor.close()
            conn.close()
            return jsonify({"error": "Заявка не найдена"}), 404
        
        old_status = row["status"]
        
        # Обновляем статус
        cursor.execute("""
            UPDATE requests 
            SET status = %s, updated_at = NOW()
            WHERE id = %s
        """, (new_status, request_id))
        
        # Записываем в историю
        cursor.execute("""
            INSERT INTO request_history (request_id, old_status, new_status, changed_by, comment)
            VALUES (%s, %s, %s, %s, %s)
        """, (request_id, old_status, new_status, changed_by, comment))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({
            "success": True,
            "message": f"✅ Статус изменён: '{old_status}' → '{new_status}'",
            "new_status": new_status
        })
        
    except Exception as e:
        print(f"❌ Ошибка обновления статуса: {e}")
        return jsonify({"error": "Внутренняя ошибка сервера"}), 500

# ================= НАЗНАЧЕНИЕ МАСТЕРА =================
@app.route("/api/requests/<int:request_id>/assign", methods=["PATCH"])
def assign_master(request_id):
    try:
        data = request.get_json()
        master_name = data.get("master_name")
        
        if not master_name:
            return jsonify({"error": "Имя мастера обязательно"}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            UPDATE requests 
            SET master_assigned = %s, updated_at = NOW()
            WHERE id = %s
        """, (master_name, request_id))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({
            "success": True,
            "message": f"✅ Мастер '{master_name}' назначен"
        })
        
    except Exception as e:
        print(f"❌ Ошибка назначения мастера: {e}")
        return jsonify({"error": "Внутренняя ошибка сервера"}), 500

# ================= ЗАГРУЗКА ФОТО =================
@app.route("/api/uploads/<filename>")
def serve_upload(filename):
    try:
        return send_from_directory(UPLOAD_FOLDER, filename)
    except FileNotFoundError:
        return jsonify({"error": "Файл не найден"}), 404

# ================= УДАЛЕНИЕ ЗАЯВКИ (только админ) =================
@app.route("/api/requests/<int:request_id>", methods=["DELETE"])
def delete_request(request_id):
    try:
        # В продакшене добавьте проверку роли админа!
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Сначала удаляем файлы (опционально)
        cursor.execute("SELECT photos FROM requests WHERE id = %s", (request_id,))
        row = cursor.fetchone()
        if row and row["photos"]:
            for filename in row["photos"]:
                filepath = os.path.join(UPLOAD_FOLDER, filename)
                if os.path.exists(filepath):
                    os.remove(filepath)
        
        # Удаляем запись (история удалится автоматически из-за ON DELETE CASCADE)
        cursor.execute("DELETE FROM requests WHERE id = %s", (request_id,))
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({"success": True, "message": "✅ Заявка удалена"})
        
    except Exception as e:
        print(f"❌ Ошибка удаления: {e}")
        return jsonify({"error": "Внутренняя ошибка сервера"}), 500

# ================= ЗАПУСК =================
if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)