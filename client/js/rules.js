document.addEventListener('DOMContentLoaded', () => {
    
    // ===== 1. ЧТЕНИЕ РОЛИ =====
    const userRole = localStorage.getItem('uhome_user_role') || 'student';
    console.log(`📋 Правила: роль "${userRole}"`);

    // ===== 2. ЭЛЕМЕНТЫ DOM =====
    const rulesContainer = document.getElementById('rulesContainer');
    const menuBtn = document.getElementById('menuBtn');
    const sideMenu = document.getElementById('sideMenu');
    const menuClose = document.getElementById('menuClose');
    const menuOverlay = document.getElementById('sideMenuOverlay');
    const menuNav = document.getElementById('menuNav');
    const menuAvatar = document.getElementById('menuAvatar');
    const menuUserName = document.getElementById('menuUserName');
    const menuUserRole = document.getElementById('menuUserRole');
    const userProfileBlock = document.getElementById('userProfileBlock');

    // ===== 3. ДАННЫЕ ПОЛЬЗОВАТЕЛЕЙ =====
    const users = {
        student: { name: 'Игорь Иванов', role: 'Студент', avatar: 'https://ui-avatars.com/api/?name=Игорь+Иванов&background=F47920&color=fff&size=300' },
        admin: { name: 'Ирина Павлова', role: 'Комендант', avatar: 'https://ui-avatars.com/api/?name=Ирина+Павлова&background=F47920&color=fff&size=300' },
        Studsovet: { name: 'Анна Советова', role: 'Студсовет', avatar: 'https://ui-avatars.com/api/?name=Анна+Советова&background=F47920&color=fff&size=300' },
        Electrick: { name: 'Павел Краскин', role: 'Электрик', avatar: 'https://ui-avatars.com/api/?name=Павел+Краскин&background=F47920&color=fff&size=300' },
        Slesar: { name: 'Алексей Слесарев', role: 'Слесарь', avatar: 'https://ui-avatars.com/api/?name=Алексей+Слесарев&background=F47920&color=fff&size=300' },
        Santex: { name: 'Дмитрий Водопроводов', role: 'Сантехник', avatar: 'https://ui-avatars.com/api/?name=Дмитрий+Водопроводов&background=F47920&color=fff&size=300' }
    };

    const user = users[userRole] || users.student;

    // ===== 4. СПИСОК ПРАВИЛ =====
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

    // ===== 5. ОТРИСОВКА ПРАВИЛ =====
    function renderRules() {
        if (!rulesContainer) return;

        let html = '';
        rules.forEach((rule, index) => {
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

    // ===== 6. ПЕРЕКЛЮЧЕНИЕ ПРАВИЛ (АККОРДЕОН) =====
    window.toggleRule = function(id) {
        const ruleItem = document.querySelector(`.rule-item[data-id="${id}"]`);
        if (!ruleItem) return;

        // Закрываем все остальные (опционально)
        // document.querySelectorAll('.rule-item').forEach(item => {
        //     if (item !== ruleItem) item.classList.remove('active');
        // });

        // Переключаем текущее
        ruleItem.classList.toggle('active');
    };

    // ===== 7. БОКОВОЕ МЕНЮ =====
    function updateMenu() {
        if (!menuNav) return;
        
        const menuItems = {
            student: [
                { label: 'Главная', icon: 'home', href: 'glav.html' },
                { label: 'Правила проживания', icon: 'rules', href: 'rules.html', active: true },
                { label: 'Подбор соседа', icon: 'neighbor', href: 'neighbor.html' }
            ],
            admin: [
                { label: 'Главная', icon: 'home', href: 'glav.html' },
                { label: 'Правила проживания', icon: 'rules', href: 'rules.html', active: true },
                { label: 'Подбор соседа', icon: 'neighbor', href: 'neighbor.html' }
            ],
            Studsovet: [
                { label: 'Главная', icon: 'home', href: 'glav.html' },
                { label: 'Правила проживания', icon: 'rules', href: 'rules.html', active: true },
                { label: 'Подбор соседа', icon: 'neighbor', href: 'neighbor.html' }
            ],
            Electrick: [
                { label: 'Главная', icon: 'home', href: 'glav.html' },
                { label: 'Правила проживания', icon: 'rules', href: 'rules.html', active: true }
            ],
            Slesar: [
                { label: 'Главная', icon: 'home', href: 'glav.html' },
                { label: 'Правила проживания', icon: 'rules', href: 'rules.html', active: true }
            ],
            Santex: [
                { label: 'Главная', icon: 'home', href: 'glav.html' },
                { label: 'Правила проживания', icon: 'rules', href: 'rules.html', active: true }
            ]
        };

        const icons = {
            home: '<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"/></svg>',
            rules: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
            neighbor: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
        };

        const items = menuItems[userRole] || menuItems.student;
        let html = '';
        items.forEach(item => {
            const isActive = item.active ? 'active' : '';
            const svgIcon = icons[item.icon] || icons.home;
            html += `<a href="${item.href}" class="menu-nav-link ${isActive}">${svgIcon}<span>${item.label}</span></a>`;
        });
        menuNav.innerHTML = html;
    }

    updateMenu();

    // Обновление профиля в меню
    if (menuAvatar) menuAvatar.src = user.avatar;
    if (menuUserName) menuUserName.textContent = user.name;
    if (menuUserRole) menuUserRole.textContent = user.role;

    // Открытие/закрытие меню
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

    // Клик по профилю → переход на profile.html
    if (userProfileBlock) {
        userProfileBlock.style.cursor = 'pointer';
        userProfileBlock.addEventListener('click', () => {
            closeMenu();
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 300);
        });
    }

    // Клик по ссылкам меню
    if (menuNav) {
        menuNav.addEventListener('click', (e) => {
            const link = e.target.closest('.menu-nav-link');
            if (link) {
                closeMenu();
            }
        });
    }

    console.log('✅ Страница правил загружена');
});