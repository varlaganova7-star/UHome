import asyncio, asyncpg, os
from dotenv import load_dotenv

load_dotenv()
dsn = os.getenv("DATABASE_URL")

async def test():
    print(f"🔍 Подключение к: {dsn.replace('123456', '***') if '123456' in dsn else dsn}")
    try:
        conn = await asyncpg.connect(dsn, ssl=False, timeout=10)
        print("✅ Подключение успешно!")
        await conn.close()
    except asyncpg.InvalidPasswordError:
        print("❌ Причина: Неверный пароль или pg_hba.conf требует другой метод аутентификации")
    except asyncpg.ConnectionDoesNotExistError:
        print("❌ Причина: Сервер разорвал соединение (проверьте ssl=False и pg_hba.conf)")
    except asyncpg.PostgresError as e:
        print(f"❌ Ошибка PostgreSQL: {e}")
    except Exception as e:
        print(f"❌ Системная ошибка: {type(e).__name__}: {e}")

asyncio.run(test())