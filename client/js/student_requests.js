// student_requests.js
document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 🔐 ПРОВЕРКА АВТОРИЗАЦИИ
    // =========================================
    const isLoggedIn = localStorage.getItem('uhome_logged_in') === 'true';
    const userName = localStorage.getItem('uhome_user_fullname');
    const rawRole = localStorage.getItem('uhome_user_role'); // ← переименовали, чтобы не конфликтовало

    if (!isLoggedIn || !userName) {
        window.location.href = 'sign_up.html';
        return;
    }

    // Нормализация роли для меню (student/master/admin)
    let userRole = 'student';
    if (['Electrick', 'Plumber', 'Carpenter', 'master', 'Slesar', 'Santex'].includes(rawRole)) {
        userRole = 'master';
    } else if (['admin', 'studsovet'].includes(rawRole)) {
        userRole = rawRole;
    }

    // Текст роли для отображения
    const roleTextMap = {
        'student': 'Студент',
        'admin': 'Администрация',
        'studsovet': 'Студсовет',
        'master': 'Мастер'
    };
    const roleText = roleTextMap[userRole] || 'Студент';

    // =========================================
    // API CONFIG
    // =========================================
    const API_URL = 'http://127.0.0.1:5000/api';

    // =========================================
    // CONTAINERS
    // =========================================
    const activeContainer = document.getElementById('activeRequests');
    const historyContainer = document.getElementById('historyRequests');

    // =========================================
    // ЗАГРУЗКА ЗАЯВОК
    // =========================================
    async function loadRequests() {
        try {
            const response = await fetch(
                `${API_URL}/requests?role=${rawRole}&student_name=${encodeURIComponent(userName)}`
            );
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (err) {
            console.error('❌ Ошибка загрузки заявок:', err);
            return [];
        }
    }

    async function renderRequests() {
        const allRequests = await loadRequests();
        const studentRequests = allRequests.filter(req => req.student_name === userName);

        if (activeContainer) activeContainer.innerHTML = '';
        if (historyContainer) historyContainer.innerHTML = '';

        if (!studentRequests.length) {
            if (activeContainer) {
                activeContainer.innerHTML = '<div class="request-card empty">Заявок пока нет</div>';
            }
            return;
        }

        studentRequests.forEach((request, index) => {
            const req = {
                id: request.id,
                shortDescription: request.short_desc,
                category: request.category,
                createdAt: new Date(request.created_at).toLocaleDateString('ru-RU'),
                fullDescription: request.full_desc,
                status: request.status,
                photos: request.photos || []
            };

            const isHistory = ['Выполнено', 'Отклонено', 'Отменено'].includes(request.status);
            const card = document.createElement('div');
            card.className = 'request-card';
            card.style.animationDelay = `${index * 0.08}s`;

            const statusClass = {
                'Ожидают': 'pending', 'В работе': 'soon', 'Скоро приду': 'soon',
                'Выполнено': 'done', 'Отклонено': 'transfer', 'Нет деталей': 'details',
                'Нужно перенести': 'transfer'
            }[req.status] || 'pending';

            card.innerHTML = `
                <div class="request-top">
                    <div>
                        <div class="request-title">${req.shortDescription}</div>
                        <div class="request-category">${req.category}</div>
                        <div class="request-date">${req.createdAt}</div>
                    </div>
                    <div class="status ${statusClass}">${req.status}</div>
                </div>
                <div class="request-description">${req.fullDescription || 'Описание отсутствует'}</div>
                ${req.photos?.length ? `
                    <div class="request-photos">
                        ${req.photos.slice(0,3).map(src => 
                            `<img src="http://127.0.0.1:5000${src}" class="request-photo" onclick="window.open('http://127.0.0.1:5000${src}')">`
                        ).join('')}
                    </div>` : ''}
                <div class="request-actions">
                    <button class="action-btn edit-btn" data-id="${req.id}">Редактировать</button>
                    <button class="action-btn delete-btn" data-id="${req.id}">Удалить</button>
                </div>
            `;
            (isHistory && historyContainer ? historyContainer : activeContainer)?.appendChild(card);
        });
        initButtons();
    }

    function initButtons() {
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = Number(btn.dataset.id);
                if (!confirm('Удалить заявку?')) return;
                try {
                    const res = await fetch(`${API_URL}/requests/${id}`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' }
                    });
                    if (!res.ok) throw new Error('Не удалось удалить');
                    location.reload();
                } catch (err) { alert('Ошибка: ' + err.message); }
            });
        });
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                alert('ℹ️ Редактирование будет доступно в следующей версии.');
            });
        });
    }

    // =========================================
    // LAYOUT / MENU (без дубликатов!)
    // =========================================
    const layoutContainer = document.getElementById('layout-container');
    if (layoutContainer) {
        layoutContainer.innerHTML = `
            <header class="header">
                <a href="glav.html" class="header-logo">
                    <img src="image 10 (1).png" alt="UHome" class="logo-image">
                </a>
                <button class="menu-btn" id="menuBtn"><span></span><span></span><span></span></button>
            </header>
            <aside class="side-menu" id="sideMenu">
                <div class="side-menu-overlay" id="sideMenuOverlay"></div>
                <div class="side-menu-content">
                    <div class="menu-top"><button class="menu-close" id="menuClose">✕</button></div>
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
            </aside>`;
    }

    // DOM elements
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

    // Profile data
    const savedFullname = localStorage.getItem('uhome_user_fullname') || userName || 'Пользователь';
    const firstLetter = savedFullname.charAt(0).toUpperCase();
    const avatarUrl = `https://ui-avatars.com/api/?name=${firstLetter}&background=F47920&color=fff&size=128`;

    if (menuAvatar) menuAvatar.src = avatarUrl;
    if (menuUserName) menuUserName.textContent = savedFullname;
    if (menuUserRole) menuUserRole.textContent = roleText;

    // Icons
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

    // Menu items
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
            { label: 'Чат', icon: 'chat', href: 'chat.html' }
        ],
        studsovet: [
            { label: 'Главная', icon: 'home', href: 'glav.html' },
            { label: 'Новости', icon: 'news', href: 'news.html' },
            { label: 'Чат', icon: 'chat', href: 'chat.html' },
            { label: 'Правила проживания', icon: 'rules', href: 'rules.html' }
        ]
    };

    function renderMenu() {
        if (!menuNav) return;
        const currentPage = window.location.pathname.split('/').pop();
        const items = menuItems[userRole] || menuItems.student;
        let html = '';
        items.forEach(item => {
            const active = item.href === currentPage ? 'active' : '';
            html += `<a href="${item.href}" class="menu-nav-link ${active}"><div class="menu-icon">${icons[item.icon]}</div><span>${item.label}</span></a>`;
        });
        menuNav.innerHTML = html;
    }
    renderMenu();

    // Footer logout
    if (menuFooter) {
        menuFooter.innerHTML = `<button class="logout-btn" id="logoutBtn">${icons.logout}<span>Выйти</span></button>`;
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            ['uhome_user_role', 'uhome_user_fullname', 'uhome_logged_in', 'uhome_user_name'].forEach(k => localStorage.removeItem(k));
            closeMenu();
            setTimeout(() => { window.location.href = 'sign_up.html'; }, 200);
        });
    }

    // Menu functions
    function openMenu() { if (sideMenu) { sideMenu.classList.add('active'); document.body.style.overflow = 'hidden'; } }
    function closeMenu() { if (sideMenu) { sideMenu.classList.remove('active'); document.body.style.overflow = ''; } }

    if (menuBtn) menuBtn.addEventListener('click', openMenu);
    if (menuClose) menuClose.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
    if (menuNav) menuNav.addEventListener('click', e => { if (e.target.closest('.menu-nav-link')) closeMenu(); });
    if (userProfileBlock) userProfileBlock.addEventListener('click', () => { closeMenu(); setTimeout(() => { window.location.href = 'profile.html'; }, 250); });

    // =========================================
    // ЗАПУСК
    // =========================================
    renderRequests();
});