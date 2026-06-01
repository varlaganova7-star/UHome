from database import engine, Base
from models import User, Questionnaire

print("🔄 Создание таблиц базы данных...")
Base.metadata.create_all(bind=engine)
print("✅ Таблицы созданы успешно!")
print("📁 База данных сохранена в: backend/uhome.db")