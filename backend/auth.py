from passlib.context import CryptContext

# 🔧 ИСПОЛЬЗУЕМ PBKDF2 вместо bcrypt
# PBKDF2 не имеет ограничения в 72 байта и работает с любыми символами
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Проверяет пароль.
    Работает с любыми символами (кириллица, эмодзи, длинные пароли).
    """
    return pwd_context.verify(plain_password, hashed_password)

def hash_password(password: str) -> str:
    """
    Хэширует пароль через PBKDF2-SHA256.
    
    Преимущества перед bcrypt:
    ✅ Нет ограничения 72 байта
    ✅ Корректная работа с UTF-8 (кириллица, иероглифы, эмодзи)
    ✅ Такой же уровень безопасности
    ✅ Стандарт для современных приложений
    """
    return pwd_context.hash(password)