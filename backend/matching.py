def calculate_match(q1, q2):
    """
    Рассчитывает процент совместимости двух анкет.
    Возвращает число от 0.0 до 100.0
    """
    if not q1 or not q2:
        return 0.0
    
    score, total = 0.0, 0.0
    
    # Веса для разных критериев (чем важнее критерий, тем больше вес)
    weights = {
        'bedtime': 3,          # Время отбоя — очень важно
        'wakeup': 2,           # Время подъёма
        'noise_attitude': 3,   # Отношение к шуму — критично
        'guest_attitude': 2,   # Отношение к гостям
        'food_type': 2,        # Тип питания
        'cooking_freq': 1,     # Частота готовки
        'sharing': 2,          # Готовность делиться вещами
        'smell_tolerance': 1,  # Терпимость к запахам
        'homework_time': 1     # Время для учёбы
    }
    
    # Вспомогательная функция: проверяет, близки ли два времени (для гибкого сравнения)
    def close_times(t1, t2):
        groups = [
            ['До 22:00', '23:00-01:00'],
            ['02:00-04:00', 'После 5:00'],
            ['До 06:00', '07:00-09:00'],
            ['07:00-09:00', 'После 10:00']
        ]
        return any(t1 in g and t2 in g for g in groups)
    
    # === СРАВНЕНИЕ ПОЛЕЙ ===
    
    # 1. Время отбоя (bedtime)
    if q1.bedtime and q2.bedtime:
        total += weights['bedtime']
        if q1.bedtime == q2.bedtime:
            score += weights['bedtime']  # Точное совпадение
        elif close_times(q1.bedtime, q2.bedtime):
            score += weights['bedtime'] / 2  # Близкое значение
    
    # 2. Время подъёма (wakeup)
    if q1.wakeup and q2.wakeup:
        total += weights['wakeup']
        if q1.wakeup == q2.wakeup:
            score += weights['wakeup']
    
    # 3. Отношение к шуму (noise_attitude: 1-5)
    if q1.noise_attitude is not None and q2.noise_attitude is not None:
        total += weights['noise_attitude']
        diff = abs(q1.noise_attitude - q2.noise_attitude)
        if diff <= 1:
            score += weights['noise_attitude']  # Разница в 1 балл — ок
        elif diff == 2:
            score += weights['noise_attitude'] / 2  # Разница в 2 — частично
    
    # 4. Отношение к гостям (guest_attitude: 1-5)
    if q1.guest_attitude is not None and q2.guest_attitude is not None:
        total += weights['guest_attitude']
        if abs(q1.guest_attitude - q2.guest_attitude) <= 1:
            score += weights['guest_attitude']
    
    # 5. Тип питания (food_type)
    if q1.food_type and q2.food_type:
        total += weights['food_type']
        if q1.food_type == q2.food_type:
            score += weights['food_type']
        elif 'Стандартное' in [q1.food_type, q2.food_type]:
            score += weights['food_type'] / 2  # "Стандартное" совместимо со всем
    
    # 6. Остальные поля — только точное совпадение
    for field in ['cooking_freq', 'sharing', 'smell_tolerance', 'homework_time']:
        val1 = getattr(q1, field, None)
        val2 = getattr(q2, field, None)
        if val1 is not None and val2 is not None:
            total += weights[field]
            if val1 == val2:
                score += weights[field]
    
    # Итоговый процент
    return round((score / total) * 100, 1) if total > 0 else 0.0


def find_matches(db, user_id, min_compat=50.0):
    """
    Находит всех подходящих соседей для пользователя.
    
    Args:
        db: сессия базы данных
        user_id: ID текущего пользователя
        min_compat: минимальный процент совместимости (по умолчанию 50%)
    
    Returns:
        Список словарей: [{"user_id": ..., "fullname": ..., "compatibility": ...}, ...]
    """
    from models import User, Questionnaire
    
    # 1. Получаем анкету текущего пользователя
    my_q = db.query(Questionnaire).filter(Questionnaire.user_id == user_id).first()
    if not my_q:
        return []  # Нет анкеты — нет совпадений
    
    results = []
    
    # 2. Перебираем ВСЕ остальные анкеты в базе (цикл масштабируется автоматически!)
    for other_q in db.query(Questionnaire).filter(Questionnaire.user_id != user_id).all():
        
        # Считаем совместимость
        compat = calculate_match(my_q, other_q)
        
        # Если процент выше порога — добавляем в результаты
        if compat >= min_compat:
            
            # 🔧 Безопасное получение пользователя (защита от ошибки 'NoneType')
            user = db.query(User).filter(User.id == other_q.user_id).first()
            
            if user:  # Проверяем, что пользователь существует
                results.append({
                    "user_id": user.id,
                    "fullname": getattr(user, "fullname", f"User {user.id}"),  # Защита, если fullname нет
                    "compatibility": compat
                })
    
    # 3. Сортируем: сначала самые подходящие
    return sorted(results, key=lambda x: x["compatibility"], reverse=True)