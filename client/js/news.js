document.addEventListener('DOMContentLoaded', () => {
    
    // ===== 1. ЧТЕНИЕ РОЛИ =====
    const userRole = localStorage.getItem('uhome_user_role') || 'student';
    console.log(`🔑 Объявления: роль "${userRole}"`);

    // ===== 2. ОПРЕДЕЛЕНИЕ ТИПА ПОЛЬЗОВАТЕЛЯ =====
    const isAdmin = userRole === 'admin' || userRole === 'Studsovet';
    const isStudent = userRole === 'student';

    // ===== 3. ЭЛЕМЕНТЫ DOM =====
    const adminControls = document.getElementById('adminControls');
    const viewSection = document.getElementById('viewSection');
    const publishSection = document.getElementById('publishSection');
    const publishTabBtn = document.getElementById('publishTabBtn');
    const viewTabBtn = document.getElementById('viewTabBtn');
    const newsList = document.getElementById('newsList');
    const categoryFilter = document.getElementById('categoryFilter');
    
    // Элементы публикации
    const publishCategory = document.getElementById('publishCategory');
    const publishTitle = document.getElementById('publishTitle');
    const publishDescription = document.getElementById('publishDescription');
    const uploadArea = document.getElementById('uploadArea');
    const photoInput = document.getElementById('photoInput');
    const uploadedPhotos = document.getElementById('uploadedPhotos');
    const photoCount = document.getElementById('photoCount');
    const publishBtn = document.getElementById('publishBtn');

    // Меню
    const menuBtn = document.getElementById('menuBtn');
    const sideMenu = document.getElementById('sideMenu');
    const menuClose = document.getElementById('menuClose');
    const menuOverlay = document.getElementById('sideMenuOverlay');
    const menuNav = document.getElementById('menuNav');
    const menuAvatar = document.getElementById('menuAvatar');
    const menuUserName = document.getElementById('menuUserName');
    const menuUserRole = document.getElementById('menuUserRole');
    const userProfileBlock = document.getElementById('userProfileBlock');

    // ===== 4. ДАННЫЕ ПОЛЬЗОВАТЕЛЕЙ =====
    const users = {
        student: { name: 'Игорь Иванов', role: 'Студент', avatar: 'https://ui-avatars.com/api/?name=Игорь+Иванов&background=F47920&color=fff&size=300' },
        admin: { name: 'Ирина Павлова', role: 'Комендант', avatar: 'https://ui-avatars.com/api/?name=Ирина+Павлова&background=F47920&color=fff&size=300' },
        Studsovet: { name: 'Анна Советова', role: 'Студсовет', avatar: 'https://ui-avatars.com/api/?name=Анна+Советова&background=F47920&color=fff&size=300' },
        Electrick: { name: 'Павел Краскин', role: 'Электрик', avatar: 'https://ui-avatars.com/api/?name=Павел+Краскин&background=F47920&color=fff&size=300' },
        Slesar: { name: 'Алексей Слесарев', role: 'Слесарь', avatar: 'https://ui-avatars.com/api/?name=Алексей+Слесарев&background=F47920&color=fff&size=300' },
        Santex: { name: 'Дмитрий Водопроводов', role: 'Сантехник', avatar: 'https://ui-avatars.com/api/?name=Дмитрий+Водопроводов&background=F47920&color=fff&size=300' }
    };

    const user = users[userRole] || users.student;

    // ===== 5. ПРИМЕРЫ ОБЪЯВЛЕНИЙ =====
    const announcements = [
        {
            id: 1,
            title: 'Плановое отключение горячей воды 15 апреля',
            content: 'Уважаемые студенты! 15 апреля с 8:00 до 17:00 будет произведено отключение водоснабжения горячей воды',
            date: '10 апреля',
            category: 'important',
            categoryName: 'Важное объявление',
            views: 234
        },
        {
            id: 2,
            title: '',
            content: 'В пятницу пройдет мероприятие для иностранцев, игра в UNO\n\nАктовый зал\n19:00\n20 мая',
            date: '10 апреля',
            category: 'event',
            categoryName: 'Событие',
            hasImage: true,
            views: 156
        },
        {
            id: 3,
            title: 'Теперь в общежитие можно пропускать гостей до 23:00',
            content: 'Уважаемые студенты! Гости могут присутствовать на территории общежития с 7:00 до 23:00',
            date: '9 апреля',
            category: 'announcement',
            categoryName: 'Объявление',
            views: 412
        },
        {
            id: 4,
            title: '',
            content: '',
            date: '8 апреля',
            category: 'announcement',
            categoryName: 'Объявление',
            views: 89
        },
        {
            id: 5,
            title: 'Проверка соблюдения санитарных норм в комнатах',
            content: 'Уважаемые студенты, 10 апреля будет проводится проверка комнат на соблюдение санитарных норм. Просим оповестить старосту блока, если на момент проведения обхода вы будете отсутствовать в комнате',
            date: '7 апреля',
            category: 'sanitary',
            categoryName: '4 этаж',
            views: 567
        }
    ];

    // ===== 6. НАСТРОЙКА ИНТЕРФЕЙСА ПО РОЛЯМ =====
    if (isAdmin) {
        // Показываем кнопки админа
        adminControls.style.display = 'flex';
    } else {
        // Студент видит только список
        adminControls.style.display = 'none';
    }

    // ===== 7. ОТРИСОВКА ОБЪЯВЛЕНИЙ =====
    function renderAnnouncements(filter = '') {
        if (!newsList) return;
        
        const filtered = filter 
            ? announcements.filter(a => a.category === filter)
            : announcements;

        let html = '';
        filtered.forEach(ann => {
            const tagClass = ann.category;
            const hasStats = isAdmin ? `<button class="btn-stats">📊 Статистика</button>` : '';
            
            html += `
                <div class="news-card" data-category="${ann.category}">
                    <div class="news-header">
                        ${ann.title ? `<h3 class="news-title">${ann.title}</h3>` : ''}
                        <span class="news-tag ${tagClass}">${ann.categoryName}</span>
                    </div>
                    ${ann.hasImage ? `<div class="news-image"></div>` : ''}
                    ${ann.content ? `<p class="news-content">${ann.content}</p>` : ''}
                    <div class="news-footer">
                        <div class="news-date">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            ${ann.date}
                        </div>
                        ${hasStats}
                    </div>
                </div>
            `;
        });

        newsList.innerHTML = html;
    }

    renderAnnouncements();

    // ===== 8. ФИЛЬТРАЦИЯ ПО КАТЕГОРИЯМ =====
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            renderAnnouncements(e.target.value);
        });
    }

    // ===== 9. ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК (Опубликовать/Смотреть) =====
    if (publishTabBtn && viewTabBtn) {
        publishTabBtn.addEventListener('click', () => {
            publishTabBtn.classList.add('active');
            viewTabBtn.classList.remove('active');
            viewSection.style.display = 'none';
            publishSection.style.display = 'block';
        });

        viewTabBtn.addEventListener('click', () => {
            viewTabBtn.classList.add('active');
            publishTabBtn.classList.remove('active');
            publishSection.style.display = 'none';
            viewSection.style.display = 'block';
        });
    }

    // ===== 10. ЗАГРУЗКА ФОТО =====
    let uploadedFiles = [];

    if (uploadArea && photoInput) {
        uploadArea.addEventListener('click', () => {
            photoInput.click();
        });

        photoInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            const remaining = 5 - uploadedFiles.length;
            const filesToAdd = files.slice(0, remaining);

            filesToAdd.forEach(file => {
                if (file.type.startsWith('image/')) {
                    uploadedFiles.push(file);
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.className = 'photo-preview';
                        uploadedPhotos.appendChild(img);
                        photoCount.textContent = uploadedFiles.length;
                    };
                    reader.readAsDataURL(file);
                }
            });
        });
    }

    // ===== 11. ПУБЛИКАЦИЯ ОБЪЯВЛЕНИЯ =====
    if (publishBtn) {
        publishBtn.addEventListener('click', () => {
            const category = publishCategory.value;
            const title = publishTitle.value.trim();
            const description = publishDescription.value.trim();

            if (!category) {
                alert('Пожалуйста, выберите категорию');
                return;
            }

            if (!title && !description) {
                alert('Пожалуйста, добавьте заголовок или описание');
                return;
            }

            // Создаем новое объявление
            const categoryNames = {
                important: 'Важное объявление',
                event: 'Событие',
                announcement: 'Объявление',
                sanitary: 'Санитарные нормы'
            };

            const newAnnouncement = {
                id: Date.now(),
                title: title,
                content: description,
                date: 'Только что',
                category: category,
                categoryName: categoryNames[category] || 'Объявление',
                hasImage: uploadedFiles.length > 0,
                views: 0
            };

            // Добавляем в начало списка
            announcements.unshift(newAnnouncement);
            
            // Показываем вкладку "Смотреть"
            viewTabBtn.click();
            
            // Перерисовываем
            renderAnnouncements();
            
            // Очищаем форму
            publishCategory.value = '';
            publishTitle.value = '';
            publishDescription.value = '';
            uploadedFiles = [];
            uploadedPhotos.innerHTML = '';
            photoCount.textContent = '0';

            // Показываем уведомление
            alert('✅ Объявление опубликовано!');
        });
    }

    // ===== 12. БОКОВОЕ МЕНЮ =====
    function updateMenu() {
        if (!menuNav) return;
        
        const menuItems = {
            student: [
                { label: 'Главная', icon: 'home', href: 'glav.html' },
                { label: 'Объявления и новости', icon: 'news', href: 'news.html', active: true },
                { label: 'Подбор соседа', icon: 'neighbor', href: 'neighbor.html' }
            ],
            admin: [
                { label: 'Главная', icon: 'home', href: 'glav.html' },
                { label: 'Объявления и новости', icon: 'news', href: 'news.html', active: true },
                { label: 'Подбор соседа', icon: 'neighbor', href: 'neighbor.html' }
            ],
            Studsovet: [
                { label: 'Главная', icon: 'home', href: 'glav.html' },
                { label: 'Объявления и новости', icon: 'news', href: 'news.html', active: true },
                { label: 'Подбор соседа', icon: 'neighbor', href: 'neighbor.html' }
            ],
            Electrick: [
                { label: 'Главная', icon: 'home', href: 'glav.html' },
                { label: 'Объявления и новости', icon: 'news', href: 'news.html', active: true }
            ],
            Slesar: [
                { label: 'Главная', icon: 'home', href: 'glav.html' },
                { label: 'Объявления и новости', icon: 'news', href: 'news.html', active: true }
            ],
            Santex: [
                { label: 'Главная', icon: 'home', href: 'glav.html' },
                { label: 'Объявления и новости', icon: 'news', href: 'news.html', active: true }
            ]
        };

        const icons = {
            home: '<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"/></svg>',
            news: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>',
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

    console.log('✅ Страница объявлений загружена');
});