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
            avatar: 'https://ui-avatars.com/api/?name=Игорь+Иванов&background=F47920&color=fff&size=300'
        },
        admin: {
            name: 'Ирина Павлова',
            role: 'Комендант',
            avatar: 'https://ui-avatars.com/api/?name=Ирина+Павлова&background=F47920&color=fff&size=300'
        },
        studsovet: {
            name: 'Анна Советова',
            role: 'Студсовет',
            avatar: 'https://ui-avatars.com/api/?name=Анна+Советова&background=2E8B57&color=fff&size=300'
        },
        master: {
            name: 'Павел Краскин',
            role: 'Мастер',
            avatar: 'https://ui-avatars.com/api/?name=Павел+Краскин&background=4A90E2&color=fff&size=300'
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
        students: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
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
            { label: 'Правила проживания', icon: 'rules', href: 'rules.html', active: currentPage === 'rules.html' },
            { label: 'Регистрация гостей', icon: 'guest', href: 'guest_registration.html' },
            { label: 'Подбор соседа', icon: 'neighbor', href: 'neighbor.html' }
        ],
        master: [
            { label: 'Главная', icon: 'home', href: 'glav.html' },
            { label: 'Все заявки', icon: 'clipboard', href: 'master_requests.html' },
            { label: 'Чат с администрацией', icon: 'chat', href: 'chat.html' },
        ],
        admin: [
            { label: 'Главная', icon: 'home', href: 'glav.html' },
            { label: 'Новости', icon: 'news', href: 'news.html' },
            { label: 'Правила проживания', icon: 'rules', href: 'rules.html' },
            { label: 'Все заявки', icon: 'clipboard', href: 'master_requests.html' },
            { label: 'Чат', icon: 'chat', href: 'chat.html' },
            { label: 'Правила проживания', icon: 'rules', href: 'rules.html', active: currentPage === 'rules.html' }
        ],
        studsovet: [
            { label: 'Главная', icon: 'home', href: 'glav.html' },
            { label: 'Подача заявки на ремонт', icon: 'wrench', href: 'repair_request.html' },
            { label: 'Отслеживание статуса заявки', icon: 'clipboard', href: 'student_requests.html' },
            { label: 'Объявления и новости', icon: 'news', href: 'news.html' },
            { label: 'Чат с администрацией', icon: 'chat', href: 'chat.html' },
            { label: 'Правила проживания', icon: 'rules', href: 'rules.html', active: currentPage === 'rules.html' },
            { label: 'Регистрация гостей', icon: 'guest', href: 'guest_registration.html' },
            { label: 'Подбор соседа', icon: 'neighbor', href: 'neighbor.html' }
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
    // 📜 RULES LOGIC (Только на rules.html)
    // =====================================

    const isRulesPage = currentPage === 'rules.html';

    if (isRulesPage) {
        console.log('✅ Загружена логика правил');

        // ===== ЭЛЕМЕНТЫ ПРАВИЛ =====
        const rulesContainer = document.getElementById('rulesContainer');

        // ===== СПИСОК ПРАВИЛ =====
        const rules = [
            {
                id: 1,
                title: 'Время тишины',
                content: `
                    <p><strong>Ежедневно с 23:00 до 7:00</strong> действует режим тишины:</p>
                    <ul>
                        <li>Запрещено громко слушать музыку и смотреть фильмы</li>
                        <li>Необходимо выключать или убавлять звук на устройствах</li>
                        <li>Запрещено проведение ремонтных работ</li>
                        <li>Не допускается шумное поведение в коридорах</li>
                    </ul>
                    <p>Нарушение режима тишины влечёт за собой предупреждение.</p>
                `
            },
            {
                id: 2,
                title: 'Посещение гостей',
                content: `
                    <p><strong>Гости могут находиться в общежитии с 7:00 до 23:00</strong></p>
                    <ul>
                        <li>Все гости должны быть зарегистрированы у коменданта</li>
                        <li>При себе необходимо иметь документ, удостоверяющий личность</li>
                        <li>Гости не могут оставаться на ночь без специального разрешения</li>
                        <li>Студент несёт ответственность за поведение своих гостей</li>
                        <li>Максимальное количество гостей одновременно — 2 человека</li>
                    </ul>
                `
            },
            {
                id: 3,
                title: 'Санитарные нормы',
                content: `
                    <p><strong>Поддержание чистоты в комнатах и общих помещениях:</strong></p>
                    <ul>
                        <li>Уборка комнаты проводится не реже 1 раза в неделю</li>
                        <li>Мусор необходимо выносить ежедневно</li>
                        <li>Запрещено хранение скоропортящихся продуктов вне холодильника</li>
                        <li>После приготовления пищи необходимо убирать за собой</li>
                        <li>Санузлы и душевые убираются по графику дежурства</li>
                    </ul>
                `
            },
            {
                id: 4,
                title: 'Использование электроприборов',
                content: `
                    <p><strong>Разрешённые приборы:</strong></p>
                    <ul>
                        <li>Ноутбуки, телефоны, планшеты</li>
                        <li>Настольные лампы (до 60 Вт)</li>
                        <li>Электрочайники (только в специально отведённых местах)</li>
                    </ul>
                    <p><strong>Запрещённые приборы:</strong></p>
                    <ul>
                        <li>Обогреватели, тепловентиляторы</li>
                        <li>Электроплитки и мультиварки</li>
                        <li>Утюги (кроме гладильных комнат)</li>
                        <li>Приборы с повреждённой изоляцией</li>
                    </ul>
                `
            },
            {
                id: 5,
                title: 'Пожарная безопасность',
                content: `
                    <p><strong>Категорически запрещено:</strong></p>
                    <ul>
                        <li>Курение в помещениях общежития (только в специально отведённых местах)</li>
                        <li>Использование открытого огня (свечи, зажигалки)</li>
                        <li>Загромождение эвакуационных выходов</li>
                        <li>Самовольное отключение пожарной сигнализации</li>
                        <li>Хранение легковоспламеняющихся веществ</li>
                    </ul>
                    <p>При срабатывании пожарной сигнализации необходимо немедленно покинуть здание.</p>
                `
            },
            {
                id: 6,
                title: 'Оплата проживания',
                content: `
                    <p><strong>Сроки и порядок оплаты:</strong></p>
                    <ul>
                        <li>Оплата производится ежемесячно до 10 числа</li>
                        <li>Квитанции выдаются у коменданта</li>
                        <li>Возможна оплата через онлайн-банк</li>
                        <li>При задержке оплаты более чем на 1 месяц возможно выселение</li>
                    </ul>
                    <p><strong>Стоимость:</strong> уточнять у коменданта</p>
                `
            },
            {
                id: 7,
                title: 'Заявки на ремонт',
                content: `
                    <p><strong>Порядок подачи заявок:</strong></p>
                    <ul>
                        <li>Заявки подаются через личный кабинет или у коменданта</li>
                        <li>Срочные заявки (прорыв труб, отключение электричества) — по телефону</li>
                        <li>Плановый ремонт выполняется в течение 5 рабочих дней</li>
                        <li>Студент должен обеспечить доступ в комнату мастеру</li>
                    </ul>
                `
            },
            {
                id: 8,
                title: 'Ответственность за нарушения',
                content: `
                    <p><strong>Меры воздействия:</strong></p>
                    <ul>
                        <li>Первое нарушение — устное предупреждение</li>
                        <li>Повторное нарушение — письменное предупреждение</li>
                        <li>Систематические нарушения — выселение из общежития</li>
                        <li>Порча имущества — возмещение ущерба в полном объёме</li>
                    </ul>
                    <p>Решение о выселении принимает администрация университета.</p>
                `
            }
        ];

        // ===== ОТРИСОВКА ПРАВИЛ (АККОРДЕОН) =====
        function renderRules() {
            if (!rulesContainer) return;

            let html = '';
            rules.forEach((rule) => {
                html += `
                    <div class="rule-item" data-id="${rule.id}">
                        <div class="rule-header" onclick="toggleRule(${rule.id})">
                            <h3 class="rule-title">${rule.title}</h3>
                            <svg class="rule-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="6 9 12 15 18 9"/>
                            </svg>
                        </div>
                        <div class="rule-content">
                            <div class="rule-text">${rule.content}</div>
                        </div>
                    </div>
                `;
            });

            rulesContainer.innerHTML = html;
        }
        renderRules();

        // ===== ПЕРЕКЛЮЧЕНИЕ ПРАВИЛ (глобальная функция) =====
        window.toggleRule = function (id) {
            const ruleItem = document.querySelector(`.rule-item[data-id="${id}"]`);
            if (!ruleItem) return;

            // Переключаем текущее правило
            ruleItem.classList.toggle('active');
        };

        // ===== ДОПОЛНИТЕЛЬНО: Поиск по правилам (опционально) =====
        const rulesSearch = document.getElementById('rulesSearch');
        if (rulesSearch) {
            rulesSearch.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase().trim();
                const ruleItems = document.querySelectorAll('.rule-item');

                ruleItems.forEach(item => {
                    const title = item.querySelector('.rule-title')?.textContent.toLowerCase() || '';
                    const content = item.querySelector('.rule-text')?.textContent.toLowerCase() || '';
                    const matches = title.includes(query) || content.includes(query);
                    item.style.display = matches ? 'block' : 'none';
                });
            });
        }

        // ===== ДОПОЛНИТЕЛЬНО: Экспорт правил в PDF (опционально) =====
        const exportBtn = document.getElementById('exportRulesBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                alert('📄 Функция экспорта будет доступна в следующей версии');
                // В реальном проекте: использовать jsPDF или window.print()
            });
        }
    }

    console.log('✅ UHome: Все модули загружены');
});