document.addEventListener('DOMContentLoaded', async () => {

    // =====================================
    // 🧱 LAYOUT: Вставка шапки и меню
    // =====================================

    const layoutContainer = document.getElementById('layout-container');

    if (layoutContainer) {
        layoutContainer.innerHTML = `
            <!-- HEADER -->
            <header class="header">
                <a href="glav.html" class="header-logo">
                    <img src="image 10 (1).png" alt="UHome" class="logo-image">
                </a>
                <button class="menu-btn" id="menuBtn">
                    <span></span><span></span><span></span>
                </button>
            </header>

            <!-- SIDE MENU -->
            <aside class="side-menu" id="sideMenu">
                <div class="side-menu-overlay" id="sideMenuOverlay"></div>
                <div class="side-menu-content">
                    <div class="menu-top">
                        <button class="menu-close" id="menuClose">✕</button>
                    </div>
                    <div class="user-profile" id="userProfileBlock">
                        <img src="" alt="" class="user-avatar" id="menuAvatar">
                        <div class="user-info">
                            <div class="user-name" id="menuUserName"></div>
                            <div class="user-role" id="menuUserRole"></div>
                        </div>
                    </div>
                    <nav class="menu-nav" id="menuNav"></nav>
                    <div class="menu-footer" id="menuFooter"></div>
                </div>
            </aside>
        `;
    }

    // =====================================
    // 🔗 DOM ELEMENTS
    // =====================================

    const menuBtn = document.getElementById('menuBtn');
    const sideMenu = document.getElementById('sideMenu');
    const menuClose = document.getElementById('menuClose');
    const menuOverlay = document.getElementById('sideMenuOverlay');
    const menuNav = document.getElementById('menuNav');
    const menuFooter = document.getElementById('menuFooter');
    const menuAvatar = document.getElementById('menuAvatar');
    const menuUserName = document.getElementById('menuUserName');
    const menuUserRole = document.getElementById('menuUserRole');
    const userProfileBlock = document.getElementById('userProfileBlock');

    // =====================================
    // 👤 ROLE & USER LOGIC
    // =====================================

    const savedRole = localStorage.getItem('uhome_user_role');
    let userRole = 'student';

    if (['Electrick', 'Plumber', 'Carpenter', 'master'].includes(savedRole)) {
        userRole = 'master';
    } else if (savedRole === 'admin') {
        userRole = 'admin';
    } else if (savedRole === 'studsovet') {
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

    const currentUser = users[userRole] || users.student;

    // Сохраняем текущего пользователя в localStorage для чата
    localStorage.setItem('uhome_user', JSON.stringify(currentUser));

    // =====================================
    // 💬 CHAT: Глобальные переменные
    // =====================================

    let socket = null;
    const SOCKET_URL = 'http://localhost:3000';
    const API_URL = 'http://localhost:3000/api';

    // Элементы чата (есть только на chat.html)
    const messagesContainer = document.getElementById('messagesContainer');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatArea = document.getElementById('chatArea');

    // =====================================
    // 💬 CHAT: Функции
    // =====================================

    function initSocket() {
        if (socket && socket.connected) return;
        if (!currentUser) {
            console.warn('⚠️ currentUser не определен, ожидание...');
            setTimeout(initSocket, 500);
            return;
        }

        console.log(`🔌 Подключение к ${SOCKET_URL} как ${currentUser.role}...`);

        socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5
        });

        socket.on('connect', () => {
            console.log('✅ Подключено к серверу:', socket.id);
            socket.emit('register_user', {
                role: currentUser.role,
                name: currentUser.name
            });
            socket.emit('get_history');
        });

        socket.on('new_message', (msg) => {
            console.log('📨 Новое сообщение:', msg);
            if (typeof appendMessage === 'function') appendMessage(msg);
            else console.warn('⚠️ Функция appendMessage не найдена!');
            scrollToBottom();
        });

        socket.on('history', (messages) => {
            console.log('📜 Загружено сообщений:', messages.length);
            if (messagesContainer) {
                messagesContainer.innerHTML = '';
                messages.forEach(msg => {
                    if (typeof appendMessage === 'function') appendMessage(msg);
                });
                scrollToBottom();
            }
        });

        socket.on('system_message', (data) => console.log('ℹ️ Система:', data.text));
        socket.on('error', (err) => {
            console.error('❌ Ошибка сервера:', err);
            if (err.text) alert('Ошибка чата: ' + err.text);
        });
        socket.on('disconnect', (reason) => console.log('🔌 Отключено:', reason));
        socket.on('connect_error', (err) => console.error('❌ Ошибка подключения:', err.message));
    }

    function sendMessage(text, media = []) {
        if (!text.trim() && (!media || media.length === 0)) return;
        if (!socket || !socket.connected) {
            console.error('❌ Нет соединения с сервером');
            alert('⚠️ Нет соединения. Проверьте, запущен ли бэкенд.');
            return;
        }
        if (!currentUser) {
            console.error('❌ Пользователь не авторизован');
            return;
        }

        let target = 'admin';
        if (currentUser.role === 'admin' || currentUser.role === 'studsovet') {
            target = 'student';
        }

        console.log(`📤 Отправка для [${target}]:`, text);
        socket.emit('send_message', {
            text: text.trim(),
            recipient: target,
            media: media || []
        });

        if (chatInput) {
            chatInput.value = '';
            chatInput.focus();
        }
    }

    function appendMessage(msg) {
        if (!messagesContainer) return;
        const isMine = msg.sender_role === currentUser.role;
        const direction = isMine ? 'outgoing' : 'incoming';
        const date = new Date(msg.created_at);
        const timeStr = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

        let mediaHtml = '';
        if (msg.media && msg.media.length > 0) {
            mediaHtml = '<div class="media-container">';
            msg.media.forEach(item => {
                if (item.type === 'image') {
                    mediaHtml += `<div class="media-item"><img src="${item.url}" alt="photo"></div>`;
                } else if (item.type === 'video') {
                    mediaHtml += `<div class="media-item"><video src="${item.url}" controls></video></div>`;
                }
            });
            mediaHtml += '</div>';
        }

        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${direction}`;
        msgDiv.innerHTML = `
            ${!isMine ? `<div class="message-author">${msg.sender_name}</div>` : ''}
            ${msg.text ? `<div class="message-text">${msg.text}</div>` : ''}
            ${mediaHtml}
            <div class="message-time">${timeStr}</div>
        `;
        messagesContainer.appendChild(msgDiv);
    }

    function scrollToBottom() {
        if (chatArea) {
            setTimeout(() => {
                chatArea.scrollTop = chatArea.scrollHeight;
            }, 100);
        }
    }

    // =====================================
    // 👤 PROFILE: Рендер профиля в меню
    // =====================================

    if (menuAvatar) menuAvatar.src = currentUser.avatar;
    if (menuUserName) menuUserName.textContent = currentUser.name;
    if (menuUserRole) menuUserRole.textContent = currentUser.role;

    // =====================================
    // 🎨 ICONS
    // =====================================

    const icons = {
        home: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5L12 3L21 10.5"/><path d="M5 9.5V20H19V9.5"/></svg>`,
        wrench: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
        clipboard: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
        news: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/></svg>`,
        chat: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
        rules: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>`,
        guest: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6"/><path d="M23 11h-6"/></svg>`,
        neighbor: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
        logout: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`
    };

    // =====================================
    // 📋 MENU ITEMS (с учётом новых ролей)
    // =====================================

    const menuItems = {
        student: [
            { label: 'Главная', icon: 'home', href: 'glav.html' },
            { label: 'Подача заявки на ремонт', icon: 'wrench', href: 'repair_request.html' },
            { label: 'Отслеживание статуса заявки', icon: 'clipboard', href: 'student_requests.html' },
            { label: 'Объявления и новости', icon: 'news', href: 'news.html' },
            { label: 'Чат с администрацией', icon: 'chat', href: 'chat.html' },
            { label: 'Правила проживания', icon: 'rules', href: 'rules.html' },
            { label: 'Регистрация гостей', icon: 'guest', href: 'guest_registration.html' },
            { label: 'Подбор соседа', icon: 'neighbor', href: 'neighbor.html' }
        ],
        master: [
            { label: 'Главная', icon: 'home', href: 'glav.html' },
            { label: 'Все заявки', icon: 'clipboard', href: 'master_requests.html' },
            { label: 'Чат с администрацией', icon: 'chat', href: 'chat.html' }
        ],
        admin: [
            { label: 'Главная', icon: 'home', href: 'glav.html' },
            { label: 'Новости', icon: 'news', href: 'news.html' },
            { label: 'Все заявки', icon: 'clipboard', href: 'master_requests.html' },
            { label: 'Чат', icon: 'chat', href: 'chat.html' }
        ],
        studsovet: [
            { label: 'Главная', icon: 'home', href: 'glav.html' },
            { label: 'Подача заявки на ремонт', icon: 'wrench', href: 'repair_request.html' },
            { label: 'Отслеживание статуса заявки', icon: 'clipboard', href: 'student_requests.html' },
            { label: 'Объявления и новости', icon: 'news', href: 'news.html' },
            { label: 'Чат с администрацией', icon: 'chat', href: 'chat.html' },
            { label: 'Правила проживания', icon: 'rules', href: 'rules.html' },
            { label: 'Регистрация гостей', icon: 'guest', href: 'guest_registration.html' },
            { label: 'Подбор соседа', icon: 'neighbor', href: 'neighbor.html' },
            { label: 'Профиль', icon: 'user', href: 'profile.html', active: currentPage === 'profile.html' }
        ]
    };

    // =====================================
    // 🎨 RENDER MENU
    // =====================================

    function renderMenu() {
        if (!menuNav) return;
        const currentPage = window.location.pathname.split('/').pop();
        const items = menuItems[userRole] || menuItems.student;
        let html = '';

        items.forEach(item => {
            const active = item.href === currentPage ? 'active' : '';
            html += `
                <a href="${item.href}" class="menu-nav-link ${active}">
                    <div class="menu-icon">${icons[item.icon]}</div>
                    <span>${item.label}</span>
                </a>
            `;
        });

        menuNav.innerHTML = html;
    }

    renderMenu();

    // =====================================
    // 🦶 FOOTER + LOGOUT
    // =====================================

    if (menuFooter) {
        menuFooter.innerHTML = `
            <button class="logout-btn" id="logoutBtn">
                ${icons.logout}<span>Выйти</span>
            </button>
        `;
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('uhome_user_role');
            localStorage.removeItem('uhome_user');
            closeMenu();
            setTimeout(() => {
                window.location.href = 'sign_up.html';
            }, 200);
        });
    }

    // =====================================
    // 📱 MENU FUNCTIONS
    // =====================================

    function openMenu() {
        if (!sideMenu) return;
        sideMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        if (!sideMenu) return;
        sideMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    // =====================================
    // ⚡ EVENTS: Меню
    // =====================================

    if (menuBtn) menuBtn.addEventListener('click', openMenu);
    if (menuClose) menuClose.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

    if (menuNav) {
        menuNav.addEventListener('click', (e) => {
            const link = e.target.closest('.menu-nav-link');
            if (link) closeMenu();
        });
    }

    if (userProfileBlock) {
        userProfileBlock.addEventListener('click', () => {
            closeMenu();
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 250);
        });
    }

    // =====================================
    // 💬 CHAT: Инициализация (только на chat.html)
    // =====================================

    const isChatPage = window.location.pathname.includes('chat.html');

    if (isChatPage) {
        // Ждём, пока currentUser определится
        setTimeout(() => {
            if (currentUser) {
                initSocket();

                // Обработчики отправки сообщений
                if (sendBtn) {
                    sendBtn.addEventListener('click', () => {
                        sendMessage(chatInput.value);
                    });
                }
                if (chatInput) {
                    chatInput.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') sendMessage(chatInput.value);
                    });
                }
            }
        }, 300);
    }

});