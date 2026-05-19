document.addEventListener('DOMContentLoaded', async () => {

    // =====================================
    // 🔑 ROLE DETECTION (Унифицированное)
    // =====================================

    // Читаем роль: из URL → localStorage → по умолчанию
    const urlParams = new URLSearchParams(window.location.search);
    let savedRole = urlParams.get('role') || localStorage.getItem('uhome_user_role');
    
    // Нормализация ролей мастеров (приводим к единому формату)
    if (['Electrick', 'Plumber', 'Carpenter', 'master', 'Slesar', 'Santex'].includes(savedRole)) {
        savedRole = 'master';
    }
    
    let userRole = savedRole || 'student';
    localStorage.setItem('uhome_user_role', userRole);
    console.log(`🔑 Роль: "${userRole}" на странице: ${window.location.pathname}`);

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
    // 🔗 DOM ELEMENTS (Общие)
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
    // 👤 USER DATA (Все роли + мастера)
    // =====================================

    const users = {
        student: {
            name: 'Игорь Иванов',
            role: 'Студент',
            avatar: 'https://ui-avatars.com/api/?name=Игорь+Иванов&background=F47920&color=fff&size=300',
            email: 'igor@student.ru',
            room: '312',
            phone: '+7 (999) 123-45-67'
        },
        admin: {
            name: 'Ирина Павлова',
            role: 'Комендант',
            avatar: 'https://ui-avatars.com/api/?name=Ирина+Павлова&background=F47920&color=fff&size=300',
            email: 'pavlova@uhome.ru',
            room: 'Админ-офис',
            phone: '+7 (999) 000-11-22'
        },
        studsovet: {
            name: 'Анна Советова',
            role: 'Студсовет',
            avatar: 'https://ui-avatars.com/api/?name=Анна+Советова&background=2E8B57&color=fff&size=300',
            email: 'sovet@uhome.ru',
            room: 'Студсовет',
            phone: '+7 (999) 333-44-55'
        },
        master: {
            name: 'Павел Краскин',
            role: 'Мастер',
            avatar: 'https://ui-avatars.com/api/?name=Павел+Краскин&background=4A90E2&color=fff&size=300',
            email: 'kraskin@uhome.ru',
            room: 'Тех. этаж',
            phone: '+7 (999) 555-66-77'
        }
    };

    const currentUser = users[userRole] || users.student;
    localStorage.setItem('uhome_user', JSON.stringify(currentUser));

    // =====================================
    // 👤 PROFILE: Рендер профиля в меню
    // =====================================

    if (menuAvatar) menuAvatar.src = currentUser.avatar;
    if (menuUserName) menuUserName.textContent = currentUser.name;
    if (menuUserRole) menuUserRole.textContent = currentUser.role;

    // =====================================
    // 🎨 ICONS (Все иконки)
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
        logout: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
        check: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>`,
        calendar: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
        students: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
        edit: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
        save: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`,
        camera: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
        lock: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
        user: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
        mail: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
        phone: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
        room: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
    };

    // =====================================
    // 📋 MENU ITEMS (С активной страницей)
    // =====================================

    const currentPage = window.location.pathname.split('/').pop();

    const menuItems = {
        student: [
            { label: 'Главная', icon: 'home', href: 'glav.html' },
            { label: 'Подача заявки на ремонт', icon: 'wrench', href: 'repair_request.html' },
            { label: 'Отслеживание статуса заявки', icon: 'clipboard', href: 'student_requests.html' },
            { label: 'Объявления и новости', icon: 'news', href: 'news.html' },
            { label: 'Чат с администрацией', icon: 'chat', href: 'chat.html' },
            { label: 'Правила проживания', icon: 'rules', href: 'rules.html' },
            { label: 'Регистрация гостей', icon: 'guest', href: 'guest_registration.html' },
            { label: 'Подбор соседа', icon: 'neighbor', href: 'neighbor.html' },
            { label: 'Профиль', icon: 'user', href: 'profile.html', active: currentPage === 'profile.html' }
        ],
        master: [
            { label: 'Главная', icon: 'home', href: 'glav.html' },
            { label: 'Все заявки', icon: 'clipboard', href: 'master_requests.html' },
            { label: 'Чат с администрацией', icon: 'chat', href: 'chat.html' },
            { label: 'Профиль', icon: 'user', href: 'profile.html', active: currentPage === 'profile.html' }
        ],
        admin: [
            { label: 'Главная', icon: 'home', href: 'glav.html' },
            { label: 'Новости', icon: 'news', href: 'news.html' },
            { label: 'Правила проживания', icon: 'rules', href: 'rules.html' },
            { label: 'Все заявки', icon: 'clipboard', href: 'master_requests.html' },
            { label: 'Чат', icon: 'chat', href: 'chat.html' },
            { label: 'Профиль', icon: 'user', href: 'profile.html', active: currentPage === 'profile.html' }
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
        const items = menuItems[userRole] || menuItems.student;
        let html = '';

        items.forEach(item => {
            const active = item.active ? 'active' : '';
            const svgIcon = icons[item.icon] || icons.home;
            html += `
                <a href="${item.href}" class="menu-nav-link ${active}">
                    <div class="menu-icon">${svgIcon}</div>
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
        userProfileBlock.style.cursor = 'pointer';
        userProfileBlock.addEventListener('click', () => {
            closeMenu();
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 250);
        });
    }

    // =====================================
    // 👤 PROFILE LOGIC (Только на profile.html)
    // =====================================

    const isProfilePage = currentPage === 'profile.html';

    if (isProfilePage) {
        console.log('✅ Загружена логика профиля');

        // ===== ЭЛЕМЕНТЫ ПРОФИЛЯ =====
        const profileAvatar = document.getElementById('profileAvatar');
        const profileName = document.getElementById('profileName');
        const profileRole = document.getElementById('profileRole');
        const profileEmail = document.getElementById('profileEmail');
        const profileRoom = document.getElementById('profileRoom');
        const profilePhone = document.getElementById('profilePhone');
        const profileJoinDate = document.getElementById('profileJoinDate');
        
        // Кнопки редактирования
        const editBtn = document.getElementById('editProfileBtn');
        const saveBtn = document.getElementById('saveProfileBtn');
        const cancelBtn = document.getElementById('cancelEditBtn');
        
        // Поля формы
        const nameInput = document.getElementById('editName');
        const emailInput = document.getElementById('editEmail');
        const phoneInput = document.getElementById('editPhone');
        const roomInput = document.getElementById('editRoom');
        const avatarInput = document.getElementById('avatarInput');
        const avatarPreview = document.getElementById('avatarPreview');
        const cameraBtn = document.getElementById('cameraBtn');
        
        // Вкладка смены пароля
        const passwordTab = document.getElementById('passwordTab');
        const profileTab = document.getElementById('profileTab');
        const passwordSection = document.getElementById('passwordSection');
        const infoSection = document.getElementById('infoSection');
        const currentPassword = document.getElementById('currentPassword');
        const newPassword = document.getElementById('newPassword');
        const confirmNewPassword = document.getElementById('confirmNewPassword');
        const changePasswordBtn = document.getElementById('changePasswordBtn');

        // ===== ИНИЦИАЛИЗАЦИЯ ПРОФИЛЯ =====
        function initProfile() {
            // Заполняем данные
            if (profileAvatar) profileAvatar.src = currentUser.avatar;
            if (profileName) profileName.textContent = currentUser.name;
            if (profileRole) profileRole.textContent = currentUser.role;
            if (profileEmail) profileEmail.textContent = currentUser.email;
            if (profileRoom) profileRoom.textContent = currentUser.room;
            if (profilePhone) profilePhone.textContent = currentUser.phone;
            if (profileJoinDate) {
                const joinDate = new Date();
                profileJoinDate.textContent = joinDate.toLocaleDateString('ru-RU', { 
                    year: 'numeric', month: 'long', day: 'numeric' 
                });
            }
            
            // Заполняем форму редактирования
            if (nameInput) nameInput.value = currentUser.name;
            if (emailInput) emailInput.value = currentUser.email;
            if (phoneInput) phoneInput.value = currentUser.phone;
            if (roomInput) roomInput.value = currentUser.room;
            if (avatarPreview) avatarPreview.src = currentUser.avatar;
        }
        initProfile();

        // ===== ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК =====
        if (passwordTab && profileTab) {
            passwordTab.addEventListener('click', () => {
                passwordTab.classList.add('active');
                profileTab.classList.remove('active');
                if (passwordSection) passwordSection.style.display = 'block';
                if (infoSection) infoSection.style.display = 'none';
            });

            profileTab.addEventListener('click', () => {
                profileTab.classList.add('active');
                passwordTab.classList.remove('active');
                if (infoSection) infoSection.style.display = 'block';
                if (passwordSection) passwordSection.style.display = 'none';
            });
        }

        // ===== РЕЖИМ РЕДАКТИРОВАНИЯ =====
        let isEditing = false;

        function toggleEdit(enable) {
            isEditing = enable;
            
            // Поля профиля
            if (profileName) profileName.style.display = enable ? 'none' : 'block';
            if (profileEmail) profileEmail.style.display = enable ? 'none' : 'block';
            if (profilePhone) profilePhone.style.display = enable ? 'none' : 'block';
            if (profileRoom) profileRoom.style.display = enable ? 'none' : 'block';
            
            // Поля формы
            if (nameInput) nameInput.style.display = enable ? 'block' : 'none';
            if (emailInput) emailInput.style.display = enable ? 'block' : 'none';
            if (phoneInput) phoneInput.style.display = enable ? 'block' : 'none';
            if (roomInput) roomInput.style.display = enable ? 'block' : 'none';
            
            // Кнопки
            if (editBtn) editBtn.style.display = enable ? 'none' : 'flex';
            if (saveBtn) saveBtn.style.display = enable ? 'flex' : 'none';
            if (cancelBtn) cancelBtn.style.display = enable ? 'flex' : 'none';
            
            // Аватар
            if (cameraBtn) cameraBtn.style.pointerEvents = enable ? 'auto' : 'none';
            if (cameraBtn) cameraBtn.style.opacity = enable ? '1' : '0.5';
        }
        toggleEdit(false);

        // ===== КНОПКА РЕДАКТИРОВАТЬ =====
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                toggleEdit(true);
            });
        }

        // ===== КНОПКА ОТМЕНИТЬ =====
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                // Сбрасываем форму к исходным значениям
                if (nameInput) nameInput.value = currentUser.name;
                if (emailInput) emailInput.value = currentUser.email;
                if (phoneInput) phoneInput.value = currentUser.phone;
                if (roomInput) roomInput.value = currentUser.room;
                if (avatarPreview) avatarPreview.src = currentUser.avatar;
                
                toggleEdit(false);
            });
        }

        // ===== КНОПКА СОХРАНИТЬ =====
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                // Валидация
                if (nameInput && !nameInput.value.trim()) {
                    alert('Пожалуйста, введите имя');
                    return;
                }
                if (emailInput && !emailInput.value.trim()) {
                    alert('Пожалуйста, введите email');
                    return;
                }

                // Сохраняем изменения
                currentUser.name = nameInput?.value.trim() || currentUser.name;
                currentUser.email = emailInput?.value.trim() || currentUser.email;
                currentUser.phone = phoneInput?.value.trim() || currentUser.phone;
                currentUser.room = roomInput?.value.trim() || currentUser.room;

                // Обновляем localStorage
                localStorage.setItem('uhome_user', JSON.stringify(currentUser));

                // Обновляем отображение
                initProfile();
                toggleEdit(false);

                // Обновляем меню
                if (menuUserName) menuUserName.textContent = currentUser.name;
                
                alert('✅ Профиль обновлён!');
            });
        }

        // ===== ЗАГРУЗКА АВАТАРА =====
        if (cameraBtn && avatarInput) {
            cameraBtn.addEventListener('click', () => {
                avatarInput.click();
            });
        }

        if (avatarInput) {
            avatarInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const newAvatar = event.target.result;
                        
                        // Предпросмотр
                        if (avatarPreview) avatarPreview.src = newAvatar;
                        if (profileAvatar) profileAvatar.src = newAvatar;
                        if (menuAvatar) menuAvatar.src = newAvatar;
                        
                        // Сохраняем в currentUser (в реальном проекте — загрузка на сервер)
                        currentUser.avatar = newAvatar;
                        localStorage.setItem('uhome_user', JSON.stringify(currentUser));
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // ===== СМЕНА ПАРОЛЯ =====
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', () => {
                const current = currentPassword?.value;
                const newPass = newPassword?.value;
                const confirm = confirmNewPassword?.value;

                if (!current || !newPass || !confirm) {
                    alert('Пожалуйста, заполните все поля');
                    return;
                }

                if (newPass.length < 6) {
                    alert('Новый пароль должен содержать минимум 6 символов');
                    return;
                }

                if (newPass !== confirm) {
                    alert('Пароли не совпадают');
                    return;
                }

                // В реальном проекте: отправка на сервер
                // fetch('/api/auth/change-password', { method: 'POST', body: ... })

                // Очистка полей
                if (currentPassword) currentPassword.value = '';
                if (newPassword) newPassword.value = '';
                if (confirmNewPassword) confirmNewPassword.value = '';

                alert('✅ Пароль успешно изменён!');
            });
        }

        // ===== СТАТИСТИКА ПРОФИЛЯ (опционально) =====
        const statsContainer = document.getElementById('profileStats');
        if (statsContainer) {
            const stats = {
                student: [
                    { label: 'Заявок подано', value: '12' },
                    { label: 'Сообщений в чате', value: '47' },
                    { label: 'Дней в общежитии', value: '156' }
                ],
                admin: [
                    { label: 'Обработано заявок', value: '89' },
                    { label: 'Пользователей', value: '234' },
                    { label: 'Объявлений', value: '31' }
                ],
                master: [
                    { label: 'Выполнено работ', value: '45' },
                    { label: 'Средний рейтинг', value: '4.8★' },
                    { label: 'Часов работы', value: '312' }
                ]
            };

            const userStats = stats[userRole] || stats.student;
            let statsHtml = '';
            userStats.forEach(stat => {
                statsHtml += `
                    <div class="stat-item">
                        <div class="stat-value">${stat.value}</div>
                        <div class="stat-label">${stat.label}</div>
                    </div>
                `;
            });
            statsContainer.innerHTML = statsHtml;
        }
    }

    console.log('✅ UHome: Все модули загружены');
});