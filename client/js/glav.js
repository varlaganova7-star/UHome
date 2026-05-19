document.addEventListener('DOMContentLoaded', () => {

    // ===== 1. ЭЛЕМЕНТЫ =====
    const menuNav = document.getElementById('menuNav');
    const userName = document.getElementById('userName');
    const userRoleEl = document.getElementById('userRole');
    const userAvatar = document.getElementById('userAvatar');
    const sideMenu = document.getElementById('sideMenu');
    const menuBtn = document.getElementById('menuBtn');
    const menuClose = document.getElementById('menuClose');
    const menuOverlay = document.getElementById('sideMenuOverlay');

    // ===== 2. ЧТЕНИЕ РОЛИ =====
    const userRole = localStorage.getItem('uhome_user_role') || 'student';
    console.log(`🔑 Загружена роль: "${userRole}"`);



    // ===== 5. ФУНКЦИЯ ОТРИСОВКИ МЕНЮ =====
    function renderMenu(roleKey) {
        if (!menuNav) {
            console.error('❌ Не найден элемент #menuNav в HTML!');
            return;
        }

        const role = roles[roleKey] || roles.student;

        console.log(`🎨 Рендерю меню для: "${role.name}" (${role.role})`);
        console.log(`📋 Пунктов: ${role.items.length}`);

        // Обновляем профиль
        if (userName) userName.textContent = role.name;
        if (userRoleEl) userRoleEl.textContent = role.role;
        if (userAvatar) {
            userAvatar.src = role.avatar;
            userAvatar.alt = role.name;
            userAvatar.onerror = () => {
                userAvatar.src = 'https://ui-avatars.com/api/?name=User&background=ccc&color=fff&size=150';
            };
        }

        // Генерируем пункты меню
        let html = '';
        role.items.forEach((item, index) => {
            const isActive = index === role.activeIndex ? 'active' : '';
            const svgIcon = icons[item.icon] || icons.home;
            html += `
                <a href="${item.href}" class="menu-nav-link ${isActive}">
                    ${svgIcon}
                    <span>${item.label}</span>
                </a>
            `;
        });

        // Вставляем в меню
        menuNav.innerHTML = html;
        console.log('✅ Меню отрисовано!');
    }
    // ===== ОБРАБОТКА КЛИКОВ ПО ПУНКТАМ МЕНЮ =====
    if (menuNav) {
        menuNav.addEventListener('click', (e) => {
            const link = e.target.closest('.menu-nav-link');
            if (!link) return;

            const href = link.getAttribute('href');

            // Если это переход на подбор соседа — сохраняем роль в URL
            if (href && href.includes('neighbor.html')) {
                e.preventDefault(); // Останавливаем стандартный переход

                // 🔥 Сохраняем роль для следующей страницы
                const currentRole = localStorage.getItem('uhome_user_role') || 'student';

                // Закрываем меню
                closeMenu();

                // Переходим с параметром роли
                setTimeout(() => {
                    window.location.href = `neighbor.html?role=${currentRole}`;
                }, 300);
                return;
            }

            // Для остальных ссылок — просто закрываем меню
            closeMenu();
        });
    }

    // ===== 6. УПРАВЛЕНИЕ БОКОВЫМ МЕНЮ =====
    function openMenu() {
        sideMenu?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        sideMenu?.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (menuBtn) menuBtn.addEventListener('click', openMenu);
    if (menuClose) menuClose.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

    // ===== 7. ЗАПУСК =====
    renderMenu(userRole);
    // ===== КЛИК ПО ПРОФИЛЮ В БОКОВОМ МЕНЮ =====
    const userProfileBlock = document.querySelector('.user-profile');

    if (userProfileBlock) {
        userProfileBlock.style.cursor = 'pointer';
        userProfileBlock.title = 'Открыть профиль';

        userProfileBlock.addEventListener('click', () => {
            closeMenu(); // Закрываем боковое меню
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 300);
        });
    }
    // Регистрация Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('✅ SW зарегистрирован:', reg.scope))
                .catch(err => console.log('❌ Ошибка SW:', err));
        });
    }
    // layout.js

    document.addEventListener('DOMContentLoaded', () => {

        // =====================================
        // ROLE
        // =====================================

        // =====================================
        // INSERT LAYOUT
        // =====================================

        const layoutContainer =
            document.getElementById('layout-container');

        if (layoutContainer) {

            layoutContainer.innerHTML = `

            <!-- HEADER -->
            <header class="header">

                <a href="glav.html" class="header-logo">

                    <img
                        src="image 10 (1).png"
                        alt="UHome"
                        class="logo-image"
                    >

                </a>

                <button class="menu-btn" id="menuBtn">

                    <span></span>
                    <span></span>
                    <span></span>

                </button>

            </header>

            <!-- SIDE MENU -->
            <aside class="side-menu" id="sideMenu">

                <div
                    class="side-menu-overlay"
                    id="sideMenuOverlay"
                ></div>

                <div class="side-menu-content">

                    <!-- TOP -->
                    <div class="menu-top">

                        <button
                            class="menu-close"
                            id="menuClose"
                        >
                            ✕
                        </button>

                    </div>

                    <!-- PROFILE -->
                    <div
                        class="user-profile"
                        id="userProfileBlock"
                    >

                        <img
                            src=""
                            alt=""
                            class="user-avatar"
                            id="menuAvatar"
                        >

                        <div class="user-info">

                            <div
                                class="user-name"
                                id="menuUserName"
                            ></div>

                            <div
                                class="user-role"
                                id="menuUserRole"
                            ></div>

                        </div>

                    </div>

                    <!-- NAV -->
                    <nav
                        class="menu-nav"
                        id="menuNav"
                    ></nav>

                    <!-- FOOTER -->
                    <div
                        class="menu-footer"
                        id="menuFooter"
                    ></div>

                </div>

            </aside>
        `;
        }

        // =====================================
        // DOM
        // =====================================

        const menuBtn =
            document.getElementById('menuBtn');

        const sideMenu =
            document.getElementById('sideMenu');

        const menuClose =
            document.getElementById('menuClose');

        const menuOverlay =
            document.getElementById('sideMenuOverlay');

        const menuNav =
            document.getElementById('menuNav');

        const menuFooter =
            document.getElementById('menuFooter');

        const menuAvatar =
            document.getElementById('menuAvatar');

        const menuUserName =
            document.getElementById('menuUserName');

        const menuUserRole =
            document.getElementById('menuUserRole');

        const userProfileBlock =
            document.getElementById('userProfileBlock');

        // =====================================
        // ROLE
        // =====================================

        const savedRole =
            localStorage.getItem('uhome_user_role');

        let userRole = 'student';

        // MASTER ROLES

        if (
            savedRole === 'Electrick' ||
            savedRole === 'Plumber' ||
            savedRole === 'Carpenter' ||
            savedRole === 'master'
        ) {

            userRole = 'master';
        }

        // ADMIN

        else if (
            savedRole === 'admin'
        ) {

            userRole = 'admin';
        }
        // =====================================
        // USERS
        // =====================================

        const users = {

            student: {

                name: 'Игорь Иванов',

                role: 'Студент',

                avatar:
                    'https://ui-avatars.com/api/?name=Игорь+Иванов&background=F47920&color=fff'
            },

            admin: {

                name: 'Ирина Павлова',

                role: 'Администрация',

                avatar:
                    'https://ui-avatars.com/api/?name=Ирина+Павлова&background=F47920&color=fff'
            },

            master: {

                name: 'Павел Краскин',

                role: 'Мастер',

                avatar:
                    'https://ui-avatars.com/api/?name=Павел+Краскин&background=F47920&color=fff'
            }
        };

        const currentUser =
            users[userRole] || users.student;

        // =====================================
        // PROFILE
        // =====================================

        if (menuAvatar) {
            menuAvatar.src = currentUser.avatar;
        }

        if (menuUserName) {
            menuUserName.textContent = currentUser.name;
        }

        if (menuUserRole) {
            menuUserRole.textContent = currentUser.role;
        }

        // =====================================
        // ICONS
        // =====================================

        const icons = {

            home: `
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >

            <path d="M3 10.5L12 3L21 10.5"/>

            <path d="M5 9.5V20H19V9.5"/>

        </svg>
    `,
            wrench: `
        <svg width="19" height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2">

            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>

        </svg>
    `,

            clipboard: `
        <svg width="19" height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2">
            stroke-linecap="round"
            stroke-linejoin="round"
        >

            <path d="M9 11l3 3L22 4"/>

            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>

        </svg>
    `,

            news: `
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <rect x="3" y="4" width="18" height="16" rx="2"/>

            <line x1="7" y1="8" x2="17" y2="8"/>

            <line x1="7" y1="12" x2="17" y2="12"/>

            <line x1="7" y1="16" x2="13" y2="16"/>
        </svg>
    `,
            chat: `
        <svg width="19" height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2">

            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>

        </svg>
    `,

            rules: `
        <svg width="19" height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2">

            <path d="M9 12l2 2 4-4"/>

            <circle cx="12" cy="12" r="9"/>

        </svg>
    `,

            guest: `
        <svg width="19" height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2">

            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>

            <circle cx="8.5" cy="7" r="4"/>

            <path d="M20 8v6"/>

            <path d="M23 11h-6"/>

        </svg>
    `,

            neighbor: `
        <svg width="19" height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2">

            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>

            <circle cx="9" cy="7" r="4"/>

            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>

            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>

        </svg>
    `,

            logout: `
        <svg width="19" height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2">

            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>

            <polyline points="16 17 21 12 16 7"/>

            <line x1="21" y1="12" x2="9" y2="12"/>

        </svg>
    `
        };

        // =====================================
        // MENU ITEMS
        // =====================================

        const menuItems = {

            student: [

                {
                    label: 'Главная',
                    icon: 'home',
                    href: 'glav.html'
                },

                {
                    label: 'Подача заявки на ремонт',
                    icon: 'wrench',
                    href: 'repair_request.html'
                },

                {
                    label: 'Отслеживание статуса заявки',
                    icon: 'clipboard',
                    href: 'student_requests.html'
                },

                {
                    label: 'Объявления и новости',
                    icon: 'news',
                    href: 'news.html'
                },

                {
                    label: 'Чат с администрацией',
                    icon: 'chat',
                    href: 'chat.html'
                },

                {
                    label: 'Правила проживания',
                    icon: 'rules',
                    href: 'rules.html'
                },

                {
                    label: 'Регистрация гостей',
                    icon: 'guest',
                    href: 'guest_registration.html'
                },

                {
                    label: 'Подбор соседа',
                    icon: 'neighbor',
                    href: 'neighbor.html'
                }
            ],

            master: [

                {
                    label: 'Главная',
                    icon: 'home',
                    href: 'glav.html'
                },

                {
                    label: 'Все заявки',
                    icon: 'clipboard',
                    href: 'master_requests.html'
                },

                {
                    label: 'Чат с администрацией',
                    icon: 'chat',
                    href: 'chat.html'
                }
            ],

            admin: [

                {
                    label: 'Главная',
                    icon: 'home',
                    href: 'glav.html'
                },

                {
                    label: 'Новости',
                    icon: 'news',
                    href: 'news.html'
                },
                {
                    label: 'Все заявки',
                    icon: 'clipboard',
                    href: 'master_requests.html'
                },


                {
                    label: 'Чат',
                    icon: 'chat',
                    href: 'chat.html'
                }
            ]
        };

        // =====================================
        // RENDER MENU
        // =====================================

        function renderMenu() {

            if (!menuNav) return;

            const currentPage =
                window.location.pathname.split('/').pop();

            const items =
                menuItems[userRole] || menuItems.student;

            let html = '';

            items.forEach(item => {

                const active =
                    item.href === currentPage
                        ? 'active'
                        : '';

                html += `
                <a
                    href="${item.href}"
                    class="menu-nav-link ${active}"
                >

                    <div class="menu-icon">
                        ${icons[item.icon]}
                    </div>

                    <span>${item.label}</span>

                </a>
            `;
            });

            menuNav.innerHTML = html;
        }

        renderMenu();

        // =====================================
        // FOOTER
        // =====================================

        if (menuFooter) {

            menuFooter.innerHTML = `
            <button class="logout-btn" id="logoutBtn">

                ${icons.logout}

                <span>Выйти</span>

            </button>
        `;
        }

        // =====================================
        // LOGOUT
        // =====================================

        const logoutBtn =
            document.getElementById('logoutBtn');

        if (logoutBtn) {

            logoutBtn.addEventListener('click', () => {

                // очищаем роль
                localStorage.removeItem('uhome_user_role');

                // закрываем меню
                closeMenu();

                // переход
                setTimeout(() => {

                    window.location.href = 'sign_up.html';

                }, 200);
            });
        }

        // =====================================
        // MENU FUNCTIONS
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
        // EVENTS
        // =====================================

        if (menuBtn) {
            menuBtn.addEventListener(
                'click',
                openMenu
            );
        }

        if (menuClose) {
            menuClose.addEventListener(
                'click',
                closeMenu
            );
        }

        if (menuOverlay) {
            menuOverlay.addEventListener(
                'click',
                closeMenu
            );
        }

        document.addEventListener('keydown', (e) => {

            if (e.key === 'Escape') {
                closeMenu();
            }
        });

        if (menuNav) {

            menuNav.addEventListener('click', (e) => {

                const link =
                    e.target.closest('.menu-nav-link');

                if (link) {
                    closeMenu();
                }
            });
        }

        if (userProfileBlock) {

            userProfileBlock.addEventListener(
                'click',
                () => {

                    closeMenu();

                    setTimeout(() => {

                        window.location.href =
                            'profile.html';

                    }, 250);
                }
            );
        }

    });

});