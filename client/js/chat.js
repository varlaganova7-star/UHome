const currentPage = window.location.pathname.split('/').pop();
document.addEventListener('DOMContentLoaded', async () => {

    // =====================================
    // USER
    // =====================================

    const savedRole = localStorage.getItem('uhome_user_role');

    let userRole = 'student';

    if (
        savedRole === 'Electrick' ||
        savedRole === 'Plumber' ||
        savedRole === 'Carpenter' ||
        savedRole === 'master'
    ) {
        userRole = 'master';
    }
    else if (savedRole === 'admin') {
        userRole = 'admin';
    }
    else if (savedRole === 'studsovet') {
        userRole = 'studsovet';
    }

    const users = {
        student: {
            name: 'Игорь Иванов',
            role: 'Студент',
            avatar: 'https://ui-avatars.com/api/?name=Игорь+Иванов&background=F47920&color=fff'
        },

        admin: {
            name: 'Ирина Павлова',
            role: 'Администрация',
            avatar: 'https://ui-avatars.com/api/?name=Ирина+Павлова&background=F47920&color=fff'
        },

        master: {
            name: 'Павел Краскин',
            role: 'Мастер',
            avatar: 'https://ui-avatars.com/api/?name=Павел+Краскин&background=F47920&color=fff'
        },

        studsovet: {
            name: 'Студенческий совет',
            role: 'Студсовет',
            avatar: 'https://ui-avatars.com/api/?name=Студенческий+Совет&background=2E8B57&color=fff'
        }
    };

    const currentUser =
        users[userRole] || users.student;

    localStorage.setItem(
        'uhome_user',
        JSON.stringify(currentUser)
    );

    // =====================================
    // CHAT DOM
    // =====================================

    const messagesContainer =
        document.getElementById('messagesContainer');

    const chatInput =
        document.getElementById('chatInput');

    const sendBtn =
        document.getElementById('sendBtn');

    const chatArea =
        document.getElementById('chatArea');

    // =====================================
    // SOCKET
    // =====================================

    let socket = null;


    const SOCKET_URL = 'http://127.0.0.1:3000';
    const API_URL = 'http://127.0.0.1:3000/api';
    // Элементы чата (есть только на chat.html)
    const messagesContainer = document.getElementById('messagesContainer');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatArea = document.getElementById('chatArea');

    // =====================================
    // 💬 CHAT: Функции
    // =====================================

    function initSocket() {

        socket = io(SOCKET_URL);

        socket.on('connect', () => {

            console.log('Connected');

            socket.emit('register_user', {
                role: currentUser.role,
                name: currentUser.name
            });

            socket.emit('get_history');
        });

        socket.on('history', (messages) => {

            if (!messagesContainer) return;

            messagesContainer.innerHTML = '';

            messages.forEach(msg => {
                appendMessage(msg);
            });

            scrollToBottom();
        });

        socket.on('new_message', (msg) => {

            appendMessage(msg);

            scrollToBottom();
        });
    }

    function appendMessage(msg) {

        if (!messagesContainer) return;

        const isMine =
            msg.sender_role === currentUser.role;

        const date =
            new Date(msg.created_at);

        const time =
            date.toLocaleTimeString(
                'ru-RU',
                {
                    hour: '2-digit',
                    minute: '2-digit'
                }
            );

        const message =
            document.createElement('div');

        message.className =
            `message ${isMine ? 'outgoing' : 'incoming'}`;

        message.innerHTML = `
            ${
                !isMine
                    ? `<div class="message-author">${msg.sender_name}</div>`
                    : ''
            }

            <div class="message-text">
                ${msg.text || ''}
            </div>

            <div class="message-time">
                ${time}
            </div>
        `;

        messagesContainer.appendChild(message);
    }

    function sendMessage() {

        if (!chatInput) return;

        const text =
            chatInput.value.trim();

        if (!text) return;

        socket.emit('send_message', {
            text
        });

        chatInput.value = '';
    }

    function scrollToBottom() {

        if (!chatArea) return;

        setTimeout(() => {

            chatArea.scrollTop =
                chatArea.scrollHeight;

        }, 50);
    }

    // =====================================
    // EVENTS
    // =====================================

    if (sendBtn) {

        sendBtn.addEventListener(
            'click',
            sendMessage
        );
    }

    if (chatInput) {

        chatInput.addEventListener(
            'keydown',
            (e) => {

                if (e.key === 'Enter') {

                    sendMessage();
                }
            }
        );
    }
    async function loadStudentList() {
        const role = localStorage.getItem('uhome_user_role');

        // Проверка прав на фронтенде (дополнительная)
        if (role !== 'admin' && role !== 'studsovet') {
            console.warn('❌ Только администрация может видеть список студентов');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:3000/api/admin/students', {
                headers: {
                    'X-User-Role': role  // Передаём роль для проверки на бэкенде
                }
            });

            if (!response.ok) throw new Error('Ошибка загрузки');

            const data = await response.json();
            renderStudentList(data.students);

        } catch (err) {
            console.error('❌ Ошибка:', err);
            alert('Не удалось загрузить список студентов');
        }
    }

    function renderStudentList(students) {
        const container = document.getElementById('studentList');
        if (!container) return;

        if (students.length === 0) {
            container.innerHTML = '<p class="empty">Пока никто не написал</p>';
            return;
        }

        let html = '';
        students.forEach(student => {
            const time = student.last_message_at
                ? new Date(student.last_message_at).toLocaleString('ru-RU')
                : 'Неизвестно';

            html += `
            <div class="student-card" data-name="${student.name}">
                <div class="student-header">
                    <strong>${student.name}</strong>
                    <span class="student-role">${student.role}</span>
                </div>
                <div class="student-last-message">
                    "${student.last_message_text || '—'}"
                </div>
                <div class="student-meta">
                    <span>📨 ${student.message_count} сообщений</span>
                    <span>🕐 ${time}</span>
                </div>
                <button class="btn-open-chat" onclick="openChatWith('${student.name}')">
                    💬 Открыть чат
                </button>
            </div>
        `;
        });

        container.innerHTML = html;
    }

    // Глобальная функция для открытия чата с конкретным студентом
    window.openChatWith = function (studentName) {
        // Переключаем интерфейс чата на диалог с этим студентом
        console.log(`🔓 Открытие чата с: ${studentName}`);
        // Здесь ваша логика фильтрации сообщений по sender_name
    };

    initSocket();

});