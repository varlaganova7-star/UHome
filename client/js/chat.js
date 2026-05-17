document.addEventListener('DOMContentLoaded', async () => {
    // ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ДЛЯ ЧАТА =====
    let socket = null;
    let currentUser = null;
    const SOCKET_URL = 'http://localhost:3000'; // Адрес вашего Python-сервера
    const API_URL = 'http://localhost:3000/api'; // Для авторизации, если нужно

    // Элементы DOM (проверяем, что они есть)
    const messagesContainer = document.getElementById('messagesContainer');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatArea = document.getElementById('chatArea');
    function initSocket() {
        // Если сокет уже есть — не создаем новый
        if (socket && socket.connected) return;

        // Проверяем, что пользователь авторизован
        if (!currentUser) {
            console.warn('⚠️ currentUser не определен, ожидание...');
            setTimeout(initSocket, 500); // Пробуем снова через 0.5 сек
            return;
        }

        console.log(`🔌 Подключение к ${SOCKET_URL} как ${currentUser.role}...`);

        // Подключаемся
        socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'], // Пробуем оба протокола
            reconnection: true,                   // Автопереподключение
            reconnectionAttempts: 5               // 5 попыток
        });

        // 1. Успешное подключение
        socket.on('connect', () => {
            console.log('✅ Подключено к Python-серверу:', socket.id);

            // Регистрируем себя на сервере (отправляем роль и имя)
            socket.emit('register_user', {
                role: currentUser.role,
                name: currentUser.name
            });

            // Запрашиваем историю сообщений
            socket.emit('get_history');
        });

        // 2. Получение нового сообщения в реальном времени
        socket.on('new_message', (msg) => {
            console.log('📨 Новое сообщение:', msg);
            if (typeof appendMessage === 'function') {
                appendMessage(msg);
            } else {
                console.warn('⚠️ Функция appendMessage не найдена!');
            }
            scrollToBottom();
        });

        // 3. Получение истории (при загрузке)
        socket.on('history', (messages) => {
            console.log('📜 Загружено сообщений:', messages.length);
            if (messagesContainer) {
                messagesContainer.innerHTML = ''; // Очищаем чат
                messages.forEach(msg => {
                    if (typeof appendMessage === 'function') {
                        appendMessage(msg);
                    }
                });
                scrollToBottom();
            }
        });

        // 4. Системные сообщения и ошибки
        socket.on('system_message', (data) => {
            console.log('ℹ️ Система:', data.text);
        });

        socket.on('error', (err) => {
            console.error('❌ Ошибка сервера:', err);
            if (err.text) alert('Ошибка чата: ' + err.text);
        });

        // 5. Обработка отключения
        socket.on('disconnect', (reason) => {
            console.log('🔌 Отключено от сервера:', reason);
        });

        // 6. Ошибка подключения
        socket.on('connect_error', (err) => {
            console.error('❌ Не удалось подключиться:', err.message);
        });
    }
    function sendMessage(text, media = []) {
        // 1. Валидация: пусто ли сообщение?
        if (!text.trim() && (!media || media.length === 0)) return;

        // 2. Проверка: подключен ли сокет?
        if (!socket || !socket.connected) {
            console.error('❌ Нет соединения с сервером чата');
            alert('⚠️ Нет соединения с сервером. Проверьте, запущен ли бэкенд.');
            return;
        }

        // 3. Проверка: авторизован ли пользователь?
        if (!currentUser) {
            console.error('❌ Пользователь не авторизован');
            return;
        }

        // 4. Определяем получателя (Ваша бизнес-логика)
        // Студент/Мастер пишет всегда 'admin'.
        // Админ пишет 'student' (или можно сделать выбор в интерфейсе).
        let target = 'admin';
        if (currentUser.role === 'admin') {
            target = 'student'; // По умолчанию админ отвечает студенту
        }

        console.log(`📤 Отправка сообщения для [${target}]:`, text);

        // 5. Отправляем событие на сервер
        socket.emit('send_message', {
            text: text.trim(),
            recipient: target,
            media: media || []
        });

        // 6. Очищаем поле ввода (если есть)
        if (chatInput) {
            chatInput.value = '';
            chatInput.focus();
        }
    }
    // 1. Получаем данные пользователя (из localStorage или после логина)
    const savedUser = localStorage.getItem('uhome_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);

        // 2. Инициализируем сокет
        initSocket();
    }

    // 3. Вешаем обработчик на кнопку отправки
    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            sendMessage(chatInput.value);
        });
    }

    // 4. Отправка по Enter
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage(chatInput.value);
            }
        });
    }
});

