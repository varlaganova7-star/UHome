// ===== КОНФИГУРАЦИЯ =====
const SOCKET_URL = 'http://127.0.0.1:3000';
const API_URL = 'http://127.0.0.1:3000/api';

// ===== ГЛОБАЛЬНОЕ СОСТОЯНИЕ =====
const chatState = {
    socket: null,
    userRole: null,
    userName: null,
    currentChat: null,
    messages: [],
    chatUsers: []
};

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', async () => {
    chatState.userRole = normalizeRole(localStorage.getItem('uhome_user_role'));
    chatState.userName = localStorage.getItem('uhome_user_name') || 'Гость';
    
    if (!localStorage.getItem('uhome_logged_in')) {
        window.location.href = 'sign_up.html';
        return;
    }
    
    connectSocket();
    renderChatInterface();
});

// ===== НОРМАЛИЗАЦИЯ РОЛИ =====
function normalizeRole(role) {
    const map = {
        'admin': 'admin', 'Администрация': 'admin', 'Administration': 'admin',
        'master': 'master', 'Мастер': 'master',
        'Electrick': 'master', 'Plumber': 'master', 'Carpenter': 'master',
        'Slesar': 'master', 'Santex': 'master',
        'student': 'student', 'Студент': 'student', 'studsovet': 'student'
    };
    return map[role] || 'student';
}

// ===== ПОДКЛЮЧЕНИЕ К SOCKET.IO =====
function connectSocket() {
    chatState.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5
    });
    
    chatState.socket.on('connect', () => {
        console.log('✅ Подключено к чату');
        chatState.socket.emit('register_user', {
            role: chatState.userRole,
            name: chatState.userName
        });
    });
    
    chatState.socket.on('user_registered', (data) => {
        console.log(`👤 ${data.message}`);
    });
    
    chatState.socket.on('chat_list', (users) => {
        chatState.chatUsers = users;
        renderChatList(users);
    });
    
    chatState.socket.on('chat_history', (data) => {
        chatState.messages = data.messages;
        renderMessages(data.messages, data.partner_name);
    });
    
    chatState.socket.on('new_message', (msg) => {
        handleNewMessage(msg);
    });
    
    chatState.socket.on('new_chat_notification', (notif) => {
        if (chatState.userRole === 'admin') {
            showNotification(`📨 ${notif.user_name}: ${notif.preview}`);
            loadChatUsers();
        }
    });
    
    chatState.socket.on('error', (err) => {
        console.error('❌ Ошибка чата:', err.text);
    });
}

// ===== РЕНДЕР ИНТЕРФЕЙСА =====
function renderChatInterface() {
    const container = document.getElementById('chatContainer');
    if (!container) return;
    
    if (chatState.userRole === 'admin') {
        container.innerHTML = `
            <div class="chat-layout admin-layout">
                <aside class="chat-sidebar">
                    <div class="sidebar-header"><h3>Чаты</h3></div>
                    <div id="chatUsersList" class="chat-users-list"><p class="loading">Загрузка...</p></div>
                </aside>
                <main class="chat-window">
                    <div class="chat-header">
                        <h4 id="chatPartnerName">Выберите чат</h4>
                    </div>
                    <div id="messagesContainer" class="messages-container">
                        <p class="empty-chat">Выберите пользователя для начала переписки</p>
                    </div>
                    <form id="messageForm" class="message-form" style="display:none">
                        <textarea id="messageInput" placeholder="Напишите сообщение..." rows="2"></textarea>
                        <button type="submit" class="send-btn">➤</button>
                    </form>
                </main>
            </div>
        `;
        loadChatUsers();
        setupAdminEventListeners();
    } else {
        container.innerHTML = `
            <div class="chat-layout user-layout">
                <main class="chat-window full-width">
                    <div class="chat-header"><h4>💬 Чат с Администрацией</h4></div>
                    <div id="messagesContainer" class="messages-container"><p class="loading">Загрузка...</p></div>
                    <form id="messageForm" class="message-form">
                        <textarea id="messageInput" placeholder="Опишите проблему..." rows="2" required></textarea>
                        <button type="submit" class="send-btn">➤</button>
                    </form>
                </main>
            </div>
        `;
        setupUserEventListeners();
    }
}

// ===== ЗАГРУЗКА СПИСКА ЧАТОВ =====
async function loadChatUsers() {
    try {
        const response = await fetch(`${API_URL}/chat/users`, {
            headers: { 'X-User-Role': chatState.userRole, 'X-User-Name': chatState.userName }
        });
        if (!response.ok) throw new Error('Ошибка');
        const users = await response.json();
        chatState.chatUsers = users;
        renderChatList(users);
    } catch (err) {
        console.error('❌ Ошибка:', err);
    }
}

// ===== ОТРИСОВКА СПИСКА =====
function renderChatList(users) {
    const list = document.getElementById('chatUsersList');
    if (!list) return;
    if (!users?.length) {
        list.innerHTML = '<p class="empty">Нет активных чатов</p>';
        return;
    }
    list.innerHTML = users.map(user => {
        const isActive = chatState.currentChat?.name === user.name ? 'active' : '';
        const roleLabel = user.role === 'master' ? '🔧 Мастер' : '🎓 Студент';
        return `
            <div class="chat-user-item ${isActive}" data-name="${user.name}" data-role="${user.role}">
                <div class="user-avatar">${user.name.charAt(0).toUpperCase()}</div>
                <div class="user-info">
                    <div class="user-name">${user.name}</div>
                    <div class="user-role">${roleLabel}</div>
                    <div class="last-message">${escapeHtml(user.last_message)}</div>
                </div>
            </div>
        `;
    }).join('');
    list.querySelectorAll('.chat-user-item').forEach(item => {
        item.addEventListener('click', () => {
            openChatWith(item.dataset.name, item.dataset.role);
        });
    });
}

// ===== ОТКРЫТИЕ ЧАТА =====
function openChatWith(userName, userRole) {
    chatState.currentChat = { name: userName, role: userRole };
    document.getElementById('chatPartnerName').textContent = `${userName} (${userRole === 'master' ? 'Мастер' : 'Студент'})`;
    document.getElementById('messageForm').style.display = 'flex';
    document.querySelectorAll('.chat-user-item').forEach(el => {
        el.classList.toggle('active', el.dataset.name === userName);
    });
    loadChatHistory(userName, userRole);
}

// ===== ЗАГРУЗКА ИСТОРИИ =====
async function loadChatHistory(partnerName, partnerRole) {
    const container = document.getElementById('messagesContainer');
    if (container) container.innerHTML = '<p class="loading">Загрузка...</p>';
    try {
        const targetName = chatState.userRole === 'admin' ? partnerName : chatState.userName;
        const targetRole = chatState.userRole === 'admin' ? partnerRole : 'admin';
        const response = await fetch(
            `${API_URL}/chat/history?partner_name=${encodeURIComponent(targetName)}&partner_role=${targetRole}&limit=100`,
            { headers: { 'X-User-Role': chatState.userRole, 'X-User-Name': chatState.userName } }
        );
        if (!response.ok) throw new Error('Ошибка');
        const data = await response.json();
        chatState.messages = data.messages;
        renderMessages(data.messages, partnerName);
    } catch (err) {
        console.error('❌ Ошибка:', err);
        if (container) container.innerHTML = '<p class="error">Не удалось загрузить</p>';
    }
}

// ===== ОТРИСОВКА СООБЩЕНИЙ =====
function renderMessages(messages, partnerName) {
    const container = document.getElementById('messagesContainer');
    if (!container) return;
    if (!messages?.length) {
        container.innerHTML = '<p class="empty-chat">Нет сообщений</p>';
        return;
    }
    let currentDate = null;
    container.innerHTML = messages.map(msg => {
        const isOwn = msg.sender_name === chatState.userName;
        const msgDate = new Date(msg.created_at).toLocaleDateString('ru-RU');
        const dateDivider = msgDate !== currentDate ? `<div class="date-divider">${msgDate === new Date().toLocaleDateString('ru-RU') ? 'Сегодня' : msgDate}</div>` : '';
        currentDate = msgDate;
        const time = new Date(msg.created_at).toLocaleTimeString('ru-RU', { hour:'2-digit', minute:'2-digit' });
        const alignClass = isOwn ? 'message-own' : 'message-other';
        return `
            ${dateDivider}
            <div class="message ${alignClass}">
                ${!isOwn ? `<div class="message-sender">${msg.sender_name}</div>` : ''}
                <div class="message-bubble">
                    <div class="message-text">${escapeHtml(msg.text)}</div>
                    <div class="message-time">${time}</div>
                </div>
            </div>
        `;
    }).join('');
    container.scrollTop = container.scrollHeight;
}

// ===== ОБРАБОТКА НОВОГО СООБЩЕНИЯ =====
function handleNewMessage(msg) {
    const isInCurrentChat = chatState.userRole === 'admin' 
        ? (msg.sender_name === chatState.currentChat?.name || msg.recipient_name === chatState.currentChat?.name)
        : (msg.sender_role === 'admin' || msg.recipient_role === 'admin');
    
    if (isInCurrentChat) {
        chatState.messages.push(msg);
        renderMessages(chatState.messages, chatState.currentChat?.name || 'Администрация');
    }
    if (chatState.userRole === 'admin' && msg.sender_role !== 'admin') {
        loadChatUsers();
    }
}

// ===== ОТПРАВКА СООБЩЕНИЯ =====
function setupMessageForm() {
    const form = document.getElementById('messageForm');
    const input = document.getElementById('messageInput');
    if (!form || !input) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        const payload = {
            text: text,
            recipient_role: 'admin',
            recipient_name: chatState.userRole === 'admin' ? chatState.currentChat?.name : undefined
        };
        chatState.socket.emit('send_message', payload);
        input.value = '';
        input.style.height = 'auto';
    });
    
    input.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });
}

function setupAdminEventListeners() { setupMessageForm(); }
function setupUserEventListeners() { setupMessageForm(); }

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(text) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('UHome Чат', { body: text });
    }
}