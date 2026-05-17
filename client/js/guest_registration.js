// guest-registration.js

document.addEventListener('DOMContentLoaded', () => {

    // ===== 1. ЧТЕНИЕ РОЛИ =====

    const userRole =
        localStorage.getItem('uhome_user_role')
        || 'student';

    // ===== 2. ЭЛЕМЕНТЫ DOM =====

    // Форма
    const guestName =
        document.getElementById('guestName');

    const guestDocument =
        document.getElementById('guestDocument');

    const guestDate =
        document.getElementById('guestDate');

    const timeFrom =
        document.getElementById('timeFrom');

    const timeTo =
        document.getElementById('timeTo');

    const registerBtn =
        document.getElementById('registerBtn');

    const cancelBtn =
        document.getElementById('cancelBtn');

    const guestHistory =
        document.getElementById('guestHistory');

    // Меню
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

    const menuAvatar =
        document.getElementById('menuAvatar');

    const menuUserName =
        document.getElementById('menuUserName');

    const menuUserRole =
        document.getElementById('menuUserRole');

    const userProfileBlock =
        document.getElementById('userProfileBlock');

    // ===== 3. ПОЛЬЗОВАТЕЛИ =====

    const users = {

        student: {
            name: 'Игорь Иванов',
            role: 'Студент',
            avatar:
                'https://ui-avatars.com/api/?name=Игорь+Иванов&background=F47920&color=fff&size=300'
        },

        admin: {
            name: 'Ирина Павлова',
            role: 'Комендант',
            avatar:
                'https://ui-avatars.com/api/?name=Ирина+Павлова&background=F47920&color=fff&size=300'
        },

        Studsovet: {
            name: 'Анна Советова',
            role: 'Студсовет',
            avatar:
                'https://ui-avatars.com/api/?name=Анна+Советова&background=F47920&color=fff&size=300'
        },

        Electrick: {
            name: 'Павел Краскин',
            role: 'Электрик',
            avatar:
                'https://ui-avatars.com/api/?name=Павел+Краскин&background=F47920&color=fff&size=300'
        },

        Slesar: {
            name: 'Алексей Слесарев',
            role: 'Слесарь',
            avatar:
                'https://ui-avatars.com/api/?name=Алексей+Слесарев&background=F47920&color=fff&size=300'
        },

        Santex: {
            name: 'Дмитрий Водопроводов',
            role: 'Сантехник',
            avatar:
                'https://ui-avatars.com/api/?name=Дмитрий+Водопроводов&background=F47920&color=fff&size=300'
        }
    };

    const user =
        users[userRole]
        || users.student;

    // ===== 4. ГОСТИ =====

    let guests =
        JSON.parse(localStorage.getItem('guestHistory'))
        || [];

    renderGuests();

    // ===== 5. РЕГИСТРАЦИЯ =====

    if (registerBtn) {

        registerBtn.addEventListener('click', () => {

            const name =
                guestName.value.trim();

            const documentValue =
                guestDocument.value.trim();

            const date =
                guestDate.value;

            const from =
                timeFrom.value;

            const to =
                timeTo.value;

            if (!name) {
                alert('Введите имя гостя');
                return;
            }

            if (!documentValue) {
                alert('Введите документ');
                return;
            }

            if (!date) {
                alert('Выберите дату');
                return;
            }

            if (!from || !to) {
                alert('Укажите время');
                return;
            }

            const guest = {

                id: Date.now(),

                name,

                document: documentValue,

                date,

                from,

                to,

                status: 'Активно'
            };

            guests.unshift(guest);

            localStorage.setItem(
                'guestHistory',
                JSON.stringify(guests)
            );

            renderGuests();

            clearForm();

            alert('✅ Гость зарегистрирован');

        });

    }

    // ===== 6. ОЧИСТКА =====

    if (cancelBtn) {

        cancelBtn.addEventListener('click', clearForm);

    }

    function clearForm() {

        guestName.value = '';

        guestDocument.value = '';

        guestDate.value = '';

        timeFrom.value = '';

        timeTo.value = '';

    }

    // ===== 7. ИСТОРИЯ =====

    function renderGuests() {

        if (!guestHistory) return;

        guestHistory.innerHTML = '';

        if (guests.length === 0) {

            guestHistory.innerHTML = `
                <div class="history-empty">
                    История гостей пока пуста
                </div>
            `;

            return;
        }

        guests.forEach(guest => {

            const card =
                document.createElement('div');

            card.className = 'history-item';

            card.innerHTML = `

                <div class="history-top">

                    <div class="history-name">
                        ${guest.name}
                    </div>

                    <div class="status-badge">
                        ${guest.status}
                    </div>

                </div>

                <div class="history-bottom">

                    <span>
                        📅 ${formatDate(guest.date)}
                    </span>

                    <span>
                        🕒 ${guest.from} — ${guest.to}
                    </span>

                </div>
            `;

            // ПОВТОРНОЕ ЗАПОЛНЕНИЕ

            card.addEventListener('click', () => {

                guestName.value =
                    guest.name;

                guestDocument.value =
                    guest.document;

                guestDate.value = '';

                timeFrom.value = '';

                timeTo.value = '';

                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });

            });

            guestHistory.appendChild(card);

        });

    }

    // ===== 8. ФОРМАТ ДАТЫ =====

    function formatDate(dateString) {

        const date =
            new Date(dateString);

        return date.toLocaleDateString('ru-RU');

    }

    // ===== 9. БОКОВОЕ МЕНЮ =====

    function updateMenu() {

        if (!menuNav) return;

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
                    href: '#'
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
                    icon: 'check',
                    href: 'rules.html'
                },

                {
                    label: 'Регистрация гостей',
                    icon: 'guest',
                    href: 'guest_registration.html',
                    active: true
                },

                {
                    label: 'Подбор соседа',
                    icon: 'neighbor',
                    href: 'neighbor.html'
                }
            ],

            admin: [

                {
                    label: 'Главная',
                    icon: 'home',
                    href: 'glav.html'
                },

                {
                    label: 'Заявки на ремонт',
                    icon: 'wrench',
                    href: 'repair_request.html'
                },

                {
                    label: 'Объявления и новости',
                    icon: 'news',
                    href: 'news.html'
                },

                {
                    label: 'Чаты со студентами',
                    icon: 'chat',
                    href: 'chat.html'
                },

                {
                    label: 'Правила проживания',
                    icon: 'check',
                    href: 'rules.html'
                },

                {
                    label: 'Регистрация гостей',
                    icon: 'guest',
                    href: 'guest-registration.html',
                    active: true
                },

                {
                    label: 'Подбор соседа',
                    icon: 'neighbor',
                    href: 'neighbor.html'
                }
            ]
        };

        // ===== ИКОНКИ =====

        const icons = {

            home:
                '<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"/></svg>',

            wrench:
                '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',

            clipboard:
                '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',

            news:
                '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>',

            chat:
                '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',

            check:
                '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',

            guest:
                '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>',

            neighbor:
                '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
        };

        const items =
            menuItems[userRole]
            || menuItems.student;

        let html = '';

        items.forEach(item => {

            const isActive =
                item.active ? 'active' : '';

            const svgIcon =
                icons[item.icon]
                || icons.home;

            html += `
                <a href="${item.href}" class="menu-nav-link ${isActive}">
                    ${svgIcon}
                    <span>${item.label}</span>
                </a>
            `;
        });

        menuNav.innerHTML = html;

    }

    updateMenu();

    // ===== 10. ДАННЫЕ ПРОФИЛЯ =====

    if (menuAvatar) {
        menuAvatar.src = user.avatar;
    }

    if (menuUserName) {
        menuUserName.textContent = user.name;
    }

    if (menuUserRole) {
        menuUserRole.textContent = user.role;
    }

    // ===== 11. ОТКРЫТИЕ / ЗАКРЫТИЕ МЕНЮ =====

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

    if (menuBtn) {
        menuBtn.addEventListener('click', openMenu);
    }

    if (menuClose) {
        menuClose.addEventListener('click', closeMenu);
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMenu);
    }

    document.addEventListener('keydown', (e) => {

        if (e.key === 'Escape') {
            closeMenu();
        }

    });

    // ===== 12. ПРОФИЛЬ =====

    if (userProfileBlock) {

        userProfileBlock.style.cursor = 'pointer';

        userProfileBlock.addEventListener('click', () => {

            closeMenu();

            setTimeout(() => {

                window.location.href = 'profile.html';

            }, 300);

        });

    }

    // ===== 13. ЗАКРЫТИЕ ПО КЛИКУ =====

    if (menuNav) {

        menuNav.addEventListener('click', (e) => {

            const link =
                e.target.closest('.menu-nav-link');

            if (link) {
                closeMenu();
            }

        });

    }

    console.log('✅ Страница регистрации гостей загружена');

});