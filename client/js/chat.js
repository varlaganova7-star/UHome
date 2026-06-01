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

    const SOCKET_URL =
        'http://localhost:3000';

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

    initSocket();

});