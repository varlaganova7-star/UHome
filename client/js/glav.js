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

    // ===== 3. ДАННЫЕ ДЛЯ КАЖДОЙ РОЛИ =====
    const roles = {
        student: {
            name: 'Игорь Иванов',
            role: 'Студент',
            avatar: `https://ui-avatars.com/api/?name=Игорь+Иванов&background=F47920&color=fff&size=150`,
            activeIndex: 0,
            items: [
                { label: 'Главная', icon: 'home', href: '#' },
                { label: 'Подача заявки на ремонт', icon: 'wrench', href: '#' },
                { label: 'Отслеживание статуса заявки', icon: 'clipboard', href: '#' },
                { label: 'Объявления и новости', icon: 'news', href: 'news.html' },
                { label: 'Чат с администрацией', icon: 'chat', href: '#' },
                { label: 'Правила проживания', icon: 'check', href: '#' },
                { label: 'Регистрация гостей', icon: 'guest', href: '#' },
                { label: 'Подбор соседа', icon: 'neighbor', href: 'neighbor.html' }
            ]
        },
        admin: {
            name: 'Ирина Павлова',
            role: 'Комендант',
            avatar: `https://ui-avatars.com/api/?name=Ирина+Павлова&background=F47920&color=fff&size=150`,
            activeIndex: 0,
            items: [
                { label: 'Главная', icon: 'home', href: '#' },
                { label: 'Заявки на ремонт', icon: 'wrench', href: '#' },
                { label: 'Статусы заявок', icon: 'clipboard', href: '#' },
                { label: 'Объявления и новости', icon: 'news', href: 'news.html' },
                { label: 'Чаты со студентами', icon: 'students', href: '#' },
                { label: 'Правила проживания', icon: 'check', href: '#' },
                { label: 'Регистрация гостей', icon: 'guest', href: '#' },
                { label: 'Подбор соседа', icon: 'neighbor', href: 'neighbor.html' }
            ]
        },
        Electrick: {
            name: 'Павел Краскин',
            role: 'Электрик',
            avatar: `https://ui-avatars.com/api/?name=Павел+Краскин&background=F47920&color=fff&size=150`,
            activeIndex: 1,
            items: [
                { label: 'Главная', icon: 'home', href: '#' },
                { label: 'Заявки на ремонт', icon: 'wrench', href: '#' },
                { label: 'Статусы заявок', icon: 'clipboard', href: '#' },
                { label: 'Чат с администрацией', icon: 'chat', href: '#' }
            ]
        },
        Slesar: {
            name: 'Алексей Слесарев',
            role: 'Слесарь',
            avatar: `https://ui-avatars.com/api/?name=Алексей+Слесарев&background=F47920&color=fff&size=150`,
            activeIndex: 1,
            items: [
                { label: 'Главная', icon: 'home', href: '#' },
                { label: 'Заявки на ремонт', icon: 'wrench', href: '#' },
                { label: 'Статусы заявок', icon: 'clipboard', href: '#' },
                { label: 'Чат с администрацией', icon: 'chat', href: '#' }
            ]
        },
        Santex: {
            name: 'Дмитрий Водопроводов',
            role: 'Сантехник',
            avatar: `https://ui-avatars.com/api/?name=Дмитрий+Водопроводов&background=F47920&color=fff&size=150`,
            activeIndex: 1,
            items: [
                { label: 'Главная', icon: 'home', href: '#' },
                { label: 'Заявки на ремонт', icon: 'wrench', href: '#' },
                { label: 'Статусы заявок', icon: 'clipboard', href: '#' },
                { label: 'Чат с администрацией', icon: 'chat', href: '#' }
            ]
        },
        Studsovet: {
            name: 'Анна Советова',
            role: 'Студенческий совет',
            avatar: `https://ui-avatars.com/api/?name=Анна+Советова&background=F47920&color=fff&size=150`,
            activeIndex: 0,
            items: [
                { label: 'Главная', icon: 'home', href: '#' },
                { label: 'Объявления и новости', icon: 'news', href: 'news.html' },
                { label: 'Мероприятия', icon: 'calendar', href: '#' },
                { label: 'Чат с администрацией', icon: 'chat', href: '#' },
                { label: 'Подбор соседа', icon: 'neighbor', href: 'neighbor.html' }
            ]
        }
    };

    // ===== 4. ИКОНКИ SVG =====
    const icons = {
        home: '<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"/></svg>',
        wrench: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
        clipboard: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
        news: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>',
        chat: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
        students: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
        check: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
        guest: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>',
        neighbor: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
        calendar: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'
    };

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
    
});