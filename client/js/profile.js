document.addEventListener('DOMContentLoaded', () => {
    
    // ===== 1. ЧТЕНИЕ РОЛИ =====
    let userRole = localStorage.getItem('uhome_user_role') || 'student';
    console.log(`🔑 Профиль: роль "${userRole}"`);

    // ===== 2. ДАННЫЕ ПОЛЬЗОВАТЕЛЕЙ =====
    const users = {
        student: {
            name: 'Игорь Иванов',
            role: 'Студент',
            avatar: 'https://ui-avatars.com/api/?name=Игорь+Иванов&background=F47920&color=fff&size=300',
            phone: '+7 954 390-21-44',
            email: 'igor.ivanov@sfu-kras.ru',
            room: '333',
            floor: '3',
            neighbor: 'Петр Петров'
        },
        admin: {
            name: 'Ирина Павлова',
            role: 'Комендант',
            avatar: 'https://ui-avatars.com/api/?name=Ирина+Павлова&background=F47920&color=fff&size=300',
            phone: '+7 954 390-21-44',
            email: 'irina.pavlova@sfu-kras.ru'
        },
        Electrick: {
            name: 'Павел Краскин',
            role: 'Электрик',
            avatar: 'https://ui-avatars.com/api/?name=Павел+Краскин&background=F47920&color=fff&size=300',
            phone: '+7 954 390-21-44',
            email: 'pavel.kraskin@sfu-kras.ru'
        },
        Slesar: {
            name: 'Алексей Слесарев',
            role: 'Слесарь',
            avatar: 'https://ui-avatars.com/api/?name=Алексей+Слесарев&background=F47920&color=fff&size=300',
            phone: '+7 954 390-21-44',
            email: 'alexey.slesarev@sfu-kras.ru'
        },
        Santex: {
            name: 'Дмитрий Водопроводов',
            role: 'Сантехник',
            avatar: 'https://ui-avatars.com/api/?name=Дмитрий+Водопроводов&background=F47920&color=fff&size=300',
            phone: '+7 954 390-21-44',
            email: 'dmitry.vodoprovodov@sfu-kras.ru'
        },
        Studsovet: {
            name: 'Анна Советова',
            role: 'Студенческий совет',
            avatar: 'https://ui-avatars.com/api/?name=Анна+Советова&background=F47920&color=fff&size=300',
            phone: '+7 954 390-21-44',
            email: 'anna.sovetova@sfu-kras.ru'
        }
    };

    const user = users[userRole] || users.student;

    // ===== 3. ЭЛЕМЕНТЫ DOM =====
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

    // ===== 4. ЗАПОЛНЕНИЕ ПРОФИЛЯ =====
    function fillProfile(data) {
        if (profileAvatar) {
            profileAvatar.src = data.avatar;
            profileAvatar.alt = data.name;
        }
        if (profileName) profileName.textContent = data.name;
        if (profileRole) profileRole.textContent = data.role;
        if (phoneInput) phoneInput.value = data.phone || '';
        if (emailInput) emailInput.value = data.email || '';

        // Показываем поля студента только для роли student
        if (userRole === 'student') {
            if (studentFields) studentFields.style.display = 'block';
            if (roomInput) roomInput.value = data.room || '';
            if (floorInput) floorInput.value = data.floor || '';
            if (neighborInput) neighborInput.value = data.neighbor || 'Нет';
        } else {
            if (studentFields) studentFields.style.display = 'none';
        }
    }

    fillProfile(user);

    // ===== 5. МЕНЮ В ШАПКЕ =====
    if (menuAvatar) menuAvatar.src = user.avatar;
    if (menuUserName) menuUserName.textContent = user.name;
    if (menuUserRole) menuUserRole.textContent = user.role;

    // ===== 6. БОКОВОЕ МЕНЮ =====
    const menuItems = {
        student: [
            { label: 'Главная', icon: 'home', href: 'glav.html' },
            { label: 'Подбор соседа', icon: 'neighbor', href: 'neighbor.html' }
           
        ],
        admin: [
            { label: 'Главная', icon: 'home', href: 'glav.html' },
            { label: 'Подбор соседа', icon: 'neighbor', href: 'neighbor.html' }
         
        ],
        Electrick: [
            { label: 'Главная', icon: 'home', href: 'glav.html' }
           
        ],
        Slesar: [
            { label: 'Главная', icon: 'home', href: 'glav.html' }
           
        ],
        Santex: [
            { label: 'Главная', icon: 'home', href: 'glav.html' }
            
        ],
        Studsovet: [
            { label: 'Главная', icon: 'home', href: 'glav.html' },
            { label: 'Подбор соседа', icon: 'neighbor', href: 'neighbor.html' }
           
        ]
    };

    const icons = {
        home: '<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"/></svg>',
        neighbor: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
        profile: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
    };

    function renderMenu() {
        if (!menuNav) return;
        const items = menuItems[userRole] || menuItems.student;
        let html = '';
        items.forEach(item => {
            const isActive = item.active ? 'active' : '';
            const svgIcon = icons[item.icon] || icons.home;
            html += `<a href="${item.href}" class="menu-nav-link ${isActive}">${svgIcon}<span>${item.label}</span></a>`;
        });
        menuNav.innerHTML = html;
    }

    renderMenu();

    // ===== 7. ОТКРЫТИЕ/ЗАКРЫТИЕ МЕНЮ =====
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

    // Клик по ссылкам меню
    if (menuNav) {
        menuNav.addEventListener('click', (e) => {
            const link = e.target.closest('.menu-nav-link');
            if (link) {
                closeMenu();
            }
        });
    }

    // ===== 8. РЕДАКТИРОВАНИЕ ПРОФИЛЯ =====
    let isEditing = false;

    if (editBtn) {
        editBtn.addEventListener('click', () => {
            isEditing = !isEditing;

            if (isEditing) {
                // Включаем редактирование
                phoneInput.disabled = false;
                emailInput.disabled = false;
                
                if (userRole === 'student') {
                    roomInput.disabled = false;
                    floorInput.disabled = false;
                    // neighbor остается readonly
                }

                editBtn.textContent = 'Отмена';
                editBtn.style.background = 'linear-gradient(135deg, #666 0%, #444 100%)';
                saveBtn.style.display = 'block';

                // Фокус на первое поле
                phoneInput.focus();
            } else {
                // Отмена редактирования
                phoneInput.disabled = true;
                emailInput.disabled = true;
                
                if (userRole === 'student') {
                    roomInput.disabled = true;
                    floorInput.disabled = true;
                }

                editBtn.textContent = 'Редактировать профиль';
                editBtn.style.background = '';
                saveBtn.style.display = 'none';

                // Восстанавливаем данные
                fillProfile(user);
            }
        });
    }

    // ===== 9. СОХРАНЕНИЕ ПРОФИЛЯ =====
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            // Собираем данные
            const updatedUser = {
                ...user,
                phone: phoneInput.value,
                email: emailInput.value
            };

            if (userRole === 'student') {
                updatedUser.room = roomInput.value;
                updatedUser.floor = floorInput.value;
            }

            // Сохраняем в localStorage
            localStorage.setItem(`uhome_user_${userRole}`, JSON.stringify(updatedUser));

            // Визуальная обратная связь
            saveBtn.textContent = '✓ Сохранено!';
            saveBtn.style.background = 'linear-gradient(135deg, #28A745 0%, #218838 100%)';

            setTimeout(() => {
                // Выходим из режима редактирования
                isEditing = false;
                phoneInput.disabled = true;
                emailInput.disabled = true;
                if (userRole === 'student') {
                    roomInput.disabled = true;
                    floorInput.disabled = true;
                }
                editBtn.textContent = 'Редактировать профиль';
                editBtn.style.background = '';
                saveBtn.style.display = 'none';
                saveBtn.textContent = 'Сохранить изменения';

                // Обновляем данные в памяти
                Object.assign(user, updatedUser);
            }, 1000);
        });
    }

    // ===== 10. ЗАГРУЗКА СОХРАНЕННЫХ ДАННЫХ =====
    const savedData = localStorage.getItem(`uhome_user_${userRole}`);
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            Object.assign(user, parsed);
            fillProfile(user);
        } catch (e) {
            console.warn('Не удалось загрузить сохранённые данные');
        }
    }

    // Блокируем поля по умолчанию
    phoneInput.disabled = true;
    emailInput.disabled = true;
    if (userRole === 'student') {
        roomInput.disabled = true;
        floorInput.disabled = true;
    }

    console.log('✅ Профиль загружен');
        // Клик по профилю → остаёмся на странице профиля (или можно обновить данные)
    const userProfileBlock = document.querySelector('.user-profile');
    if (userProfileBlock) {
        userProfileBlock.style.cursor = 'default'; // На странице профиля клик не нужен
    }
});