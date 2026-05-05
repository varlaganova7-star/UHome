document.addEventListener('DOMContentLoaded', () => {
    
    // ===== 1. ЧТЕНИЕ РОЛИ =====
    let userRole = localStorage.getItem('uhome_user_role') || 'student';
    console.log(`🔑 Профиль: роль "${userRole}"`);

    // ===== 2. ДАННЫЕ ПОЛЬЗОВАТЕЛЕЙ =====
    const users = {
        student: { name: 'Игорь Иванов', role: 'Студент', avatar: 'https://ui-avatars.com/api/?name=Игорь+Иванов&background=F47920&color=fff&size=300', phone: '+7 954 390-21-44', email: 'igor.ivanov@sfu-kras.ru', room: '333', floor: '3', neighbor: 'Петр Петров' },
        admin: { name: 'Ирина Павлова', role: 'Комендант', avatar: 'https://ui-avatars.com/api/?name=Ирина+Павлова&background=F47920&color=fff&size=300', phone: '+7 954 390-21-44', email: 'irina.pavlova@sfu-kras.ru' },
        Electrick: { name: 'Павел Краскин', role: 'Электрик', avatar: 'https://ui-avatars.com/api/?name=Павел+Краскин&background=F47920&color=fff&size=300', phone: '+7 954 390-21-44', email: 'pavel.kraskin@sfu-kras.ru' },
        Slesar: { name: 'Алексей Слесарев', role: 'Слесарь', avatar: 'https://ui-avatars.com/api/?name=Алексей+Слесарев&background=F47920&color=fff&size=300', phone: '+7 954 390-21-44', email: 'alexey.slesarev@sfu-kras.ru' },
        Santex: { name: 'Дмитрий Водопроводов', role: 'Сантехник', avatar: 'https://ui-avatars.com/api/?name=Дмитрий+Водопроводов&background=F47920&color=fff&size=300', phone: '+7 954 390-21-44', email: 'dmitry.vodoprovodov@sfu-kras.ru' },
        Studsovet: { name: 'Анна Советова', role: 'Студенческий совет', avatar: 'https://ui-avatars.com/api/?name=Анна+Советова&background=F47920&color=fff&size=300', phone: '+7 954 390-21-44', email: 'anna.sovetova@sfu-kras.ru' }
    };

    let user = { ...users[userRole] || users.student };

    // ===== 3. ЭЛЕМЕНТЫ DOM (ВСЕ ВМЕСТЕ) =====
    const profileAvatar = document.getElementById('profileAvatar');
    const profileName = document.getElementById('profileName');
    const profileRole = document.getElementById('profileRole');
    const phoneInput = document.getElementById('phoneInput');
    const emailInput = document.getElementById('emailInput');
    const studentFields = document.getElementById('studentFields');
    const roomInput = document.getElementById('roomInput');
    const floorInput = document.getElementById('floorInput');
    const neighborInput = document.getElementById('neighborInput');
    const editBtn = document.getElementById('editBtn');
    const saveBtn = document.getElementById('saveBtn');
    
    // Меню
    const menuBtn = document.getElementById('menuBtn');
    const sideMenu = document.getElementById('sideMenu');
    const menuClose = document.getElementById('menuClose');
    const menuOverlay = document.getElementById('sideMenuOverlay');
    const menuNav = document.getElementById('menuNav');
    const menuAvatar = document.getElementById('menuAvatar');
    const menuUserName = document.getElementById('menuUserName');
    const menuUserRole = document.getElementById('menuUserRole');
    
    // 🔥 ИСПРАВЛЕНИЕ: userProfileBlock объявлен здесь, а не в конце!
    const userProfileBlock = document.querySelector('.user-profile');

    // ===== 4. ЗАПОЛНЕНИЕ ПРОФИЛЯ =====
    function fillProfile(data) {
        if (profileAvatar) {
            profileAvatar.src = data.avatar;
            profileAvatar.alt = data.name;
            // 🔥 Защита от неработающего аватара
            profileAvatar.onerror = () => {
                profileAvatar.src = 'https://ui-avatars.com/api/?name=User&background=ccc&color=fff&size=300';
            };
        }
        if (profileName) profileName.textContent = data.name;
        if (profileRole) profileRole.textContent = data.role;
        if (phoneInput) phoneInput.value = data.phone || '';
        if (emailInput) emailInput.value = data.email || '';

        if (userRole === 'student') {
            if (studentFields) studentFields.style.display = 'block';
            if (roomInput) roomInput.value = data.room || '';
            if (floorInput) floorInput.value = data.floor || '';
            if (neighborInput) neighborInput.value = data.neighbor || 'Нет';
        } else {
            if (studentFields) studentFields.style.display = 'none';
        }
    }

    // Сначала загружаем сохранённые данные, потом заполняем профиль
    const savedData = localStorage.getItem(`uhome_user_${userRole}`);
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            Object.assign(user, parsed);
        } catch (e) {
            console.warn('Не удалось загрузить сохранённые данные');
        }
    }
    fillProfile(user);

    // ===== 5. МЕНЮ В ШАПКЕ =====
    if (menuAvatar) {
        menuAvatar.src = user.avatar;
        menuAvatar.onerror = () => { menuAvatar.src = 'https://ui-avatars.com/api/?name=User&background=ccc&color=fff&size=150'; };
    }
    if (menuUserName) menuUserName.textContent = user.name;
    if (menuUserRole) menuUserRole.textContent = user.role;

    // ===== 6. ОТРИСОВКА БОКОВОГО МЕНЮ =====
    function updateMenu() {
        if (!menuNav) return;
        const menuItems = {
            student: [
                { label: 'Главная', icon: 'home', href: 'glav.html' },
                { label: 'Подача заявки на ремонт', icon: 'wrench', href: '#' },
                { label: 'Отслеживание статуса заявки', icon: 'clipboard', href: '#' },
                { label: 'Объявления и новости', icon: 'news', href: 'news.html'},
                { label: 'Чат с администрацией', icon: 'chat', href: 'chat.html' },
                { label: 'Правила проживания', icon: 'check', href: 'rules.html' },
                { label: 'Регистрация гостей', icon: 'guest', href: '#' },
                { label: 'Подбор соседа', icon: 'neighbor', href: 'neighbor.html'}
            ],
            admin: [
                { label: 'Главная', icon: 'home', href: 'glav.html' },
                { label: 'Заявки на ремонт', icon: 'wrench', href: '#' },
                { label: 'Объявления и новости', icon: 'news', href: 'news.html'},
                { label: 'Чаты со студентами', icon: 'chat', href: 'chat.html' },
                { label: 'Правила проживания', icon: 'check', href: 'rules.html' },
                { label: 'Регистрация гостей', icon: 'guest', href: '#' },
                { label: 'Подбор соседа', icon: 'neighbor', href: 'neighbor.html' }
            ],
            Studsovet: [
                { label: 'Главная', icon: 'home', href: 'glav.html' },
                { label: 'Подача заявки на ремонт', icon: 'wrench', href: '#' },
                { label: 'Отслеживание статуса заявки', icon: 'clipboard', href: '#' },
                { label: 'Объявления и новости', icon: 'news', href: 'news.html'},
                { label: 'Чат с администрацией', icon: 'chat', href: 'chat.html' },
                { label: 'Правила проживания', icon: 'check', href: 'rules.html' },
                { label: 'Регистрация гостей', icon: 'guest', href: '#' },
                { label: 'Подбор соседа', icon: 'neighbor', href: 'neighbor.html' }
            ],
            Electrick: [
                { label: 'Главная', icon: 'home', href: 'glav.html' },
                { label: 'Заявки на ремонт', icon: 'wrench', href: '#' },
                { label: 'Чат с администрацией', icon: 'chat', href: 'chat.html' }
            ],
            Slesar: [
                { label: 'Главная', icon: 'home', href: 'glav.html' },
                { label: 'Заявки на ремонт', icon: 'wrench', href: '#' },
                { label: 'Чат с администрацией', icon: 'chat', href: 'chat.html' }
            ],
            Santex: [
                { label: 'Главная', icon: 'home', href: 'glav.html' },
                { label: 'Заявки на ремонт', icon: 'wrench', href: '#' },
                { label: 'Чат с администрацией', icon: 'chat', href: 'chat.html' }
            ]
        };
        const icons = {
            home: '<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"/></svg>',
            wrench: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
            clipboard: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
            news: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>',
            chat: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
            check: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
            guest: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>',
            neighbor: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
            calendar: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
            students: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
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

    // ===== 7. ОТКРЫТИЕ/ЗАКРЫТИЕ МЕНЮ =====
    function openMenu() { sideMenu?.classList.add('active'); document.body.style.overflow = 'hidden'; }
    function closeMenu() { sideMenu?.classList.remove('active'); document.body.style.overflow = ''; }
    if (menuBtn) menuBtn.addEventListener('click', openMenu);
    if (menuClose) menuClose.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

    // 🔥 ИСПРАВЛЕНИЕ: userProfileBlock теперь объявлен выше, поэтому этот код работает
    if (userProfileBlock) {
        userProfileBlock.style.cursor = 'default';
    }

    // Клик по ссылкам меню
    if (menuNav) {
        menuNav.addEventListener('click', (e) => {
            const link = e.target.closest('.menu-nav-link');
            if (link) closeMenu();
        });
    }

    // ===== 8. РЕДАКТИРОВАНИЕ ПРОФИЛЯ =====
    let isEditing = false;

    if (editBtn) {
        editBtn.addEventListener('click', () => {
            isEditing = !isEditing;
            if (isEditing) {
                // Включаем редактирование
                if (phoneInput) phoneInput.disabled = false;
                if (emailInput) emailInput.disabled = false;
                if (userRole === 'student') {
                    if (roomInput) roomInput.disabled = false;
                    if (floorInput) floorInput.disabled = false;
                }
                editBtn.textContent = 'Отмена';
                editBtn.style.background = 'linear-gradient(135deg, #666 0%, #444 100%)';
                if (saveBtn) saveBtn.style.display = 'block';
                if (phoneInput) phoneInput.focus();
            } else {
                // Отмена
                if (phoneInput) phoneInput.disabled = true;
                if (emailInput) emailInput.disabled = true;
                if (userRole === 'student') {
                    if (roomInput) roomInput.disabled = true;
                    if (floorInput) floorInput.disabled = true;
                }
                editBtn.textContent = 'Редактировать профиль';
                editBtn.style.background = '';
                if (saveBtn) saveBtn.style.display = 'none';
                fillProfile(user);
            }
        });
    }

    // ===== 9. СОХРАНЕНИЕ ПРОФИЛЯ =====
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const updatedUser = { ...user, phone: phoneInput?.value || '', email: emailInput?.value || '' };
            if (userRole === 'student') {
                updatedUser.room = roomInput?.value || '';
                updatedUser.floor = floorInput?.value || '';
            }
            localStorage.setItem(`uhome_user_${userRole}`, JSON.stringify(updatedUser));
            
            // Визуальная обратная связь
            saveBtn.textContent = '✓ Сохранено!';
            saveBtn.style.background = 'linear-gradient(135deg, #28A745 0%, #218838 100%)';
            
            setTimeout(() => {
                isEditing = false;
                if (phoneInput) phoneInput.disabled = true;
                if (emailInput) emailInput.disabled = true;
                if (userRole === 'student') {
                    if (roomInput) roomInput.disabled = true;
                    if (floorInput) floorInput.disabled = true;
                }
                editBtn.textContent = 'Редактировать профиль';
                editBtn.style.background = '';
                saveBtn.style.display = 'none';
                saveBtn.textContent = 'Сохранить изменения';
                Object.assign(user, updatedUser);
            }, 1000);
        });
    }

    // Блокируем поля по умолчанию
    if (phoneInput) phoneInput.disabled = true;
    if (emailInput) emailInput.disabled = true;
    if (userRole === 'student') {
        if (roomInput) roomInput.disabled = true;
        if (floorInput) floorInput.disabled = true;
    }

    console.log('✅ Профиль загружен');
});