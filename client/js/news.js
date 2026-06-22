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

    const currentPage = window.location.pathname.split('/').pop();

    // =====================================
    // 📰 NEWS/ANNOUNCEMENTS LOGIC (Только на news.html)
    // =====================================

    const isNewsPage = currentPage === 'news.html';

    if (isNewsPage) {
        console.log('✅ Загружена логика объявлений');

        // ===== 1. ОПРЕДЕЛЕНИЕ ТИПА ПОЛЬЗОВАТЕЛЯ =====
        const isAdmin = userRole === 'admin' || userRole === 'studsovet';
        const isStudent = userRole === 'student';

        // ===== 2. ЭЛЕМЕНТЫ DOM =====
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

        // ===== 3. ПРИМЕРЫ ОБЪЯВЛЕНИЙ (в реальном проекте — загрузка с бэкенда) =====
        let announcements =
    JSON.parse(
        localStorage.getItem('uhome_news')
    ) || [

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
            title: 'Вечер UNO для иностранных студентов',
            content: 'В пятницу пройдет мероприятие для иностранцев, игра в UNO\n\nАктовый зал\n19:00\n20 мая',
            date: '10 апреля',
            category: 'event',
            categoryName: 'Событие',
            hasImage: true,
            views: 156
        },
            { id: 3, title: 'Теперь в общежитие можно пропускать гостей до 23:00', content: 'Уважаемые студенты! Гости могут присутствовать на территории общежития с 7:00 до 23:00', date: '9 апреля', category: 'announcement', categoryName: 'Объявление', views: 412 },
            { id: 4, title: 'Проверка соблюдения санитарных норм в комнатах', content: 'Уважаемые студенты, 10 апреля будет проводится проверка комнат на соблюдение санитарных норм. Просим оповестить старосту блока, если на момент проведения обхода вы будете отсутствовать в комнате', date: '7 апреля', category: 'sanitary', categoryName: 'Важное объявление', views: 567 }
        ];

        // ДОБАВИТЬ ЭТО
        // ДОБАВИТЬ ЭТО
        // ДОБАВИТЬ ЭТО
        localStorage.setItem(
            'uhome_news',
            JSON.stringify(announcements)
        );
        // ДОБАВИТЬ ЭТО
        // ДОБАВИТЬ ЭТО
        // ДОБАВИТЬ ЭТО

        // ===== 4. НАСТРОЙКА ИНТЕРФЕЙСА ПО РОЛЯМ =====
        if (adminControls) {
            adminControls.style.display = isAdmin ? 'flex' : 'none';
        }

        // ===== 5. ОТРИСОВКА ОБЪЯВЛЕНИЙ =====
        function renderAnnouncements(filter = '') {
            if (!newsList) return;
            const filtered = filter ? announcements.filter(a => a.category === filter) : announcements;
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
                        ${ann.content ? `<p class="news-content">${ann.content.replace(/\n/g, '<br>')}</p>` : ''}
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
            newsList.innerHTML = html || '<p class="no-news">Нет объявлений в этой категории</p>';
        }

        renderAnnouncements();

        // ===== 6. ФИЛЬТРАЦИЯ ПО КАТЕГОРИЯМ =====
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                renderAnnouncements(e.target.value);
            });
        }

        // ===== 7. ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК =====
        if (publishTabBtn && viewTabBtn) {
            publishTabBtn.addEventListener('click', () => {
                publishTabBtn.classList.add('active');
                viewTabBtn.classList.remove('active');
                if (viewSection) viewSection.style.display = 'none';
                if (publishSection) publishSection.style.display = 'block';
            });

            viewTabBtn.addEventListener('click', () => {
                viewTabBtn.classList.add('active');
                publishTabBtn.classList.remove('active');
                if (publishSection) publishSection.style.display = 'none';
                if (viewSection) viewSection.style.display = 'block';
            });
        }

        // ===== 8. ЗАГРУЗКА ФОТО =====
        let uploadedFiles = [];
        if (uploadArea && photoInput) {
            uploadArea.addEventListener('click', () => { photoInput.click(); });
            
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
                            if (photoCount) photoCount.textContent = uploadedFiles.length;
                        };
                        reader.readAsDataURL(file);
                    }
                });
            });
        }

        // ===== 9. ПУБЛИКАЦИЯ ОБЪЯВЛЕНИЯ =====
        if (publishBtn) {
            publishBtn.addEventListener('click', () => {
                const category = publishCategory?.value;
                const title = publishTitle?.value.trim() || '';
                const description = publishDescription?.value.trim() || '';
                
                if (!category) { alert('Пожалуйста, выберите категорию'); return; }
                if (!title && !description) { alert('Пожалуйста, добавьте заголовок или описание'); return; }
                
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
                
                announcements.unshift(newAnnouncement);

                // ДОБАВИТЬ ЭТО
                // ДОБАВИТЬ ЭТО
                // ДОБАВИТЬ ЭТО
                localStorage.setItem(
                    'uhome_news',
                    JSON.stringify(announcements)
                );
                // ДОБАВИТЬ ЭТО
                // ДОБАВИТЬ ЭТО
                // ДОБАВИТЬ ЭТО
                
                // Переключаемся на вкладку просмотра и перерисовываем
                if (viewTabBtn) viewTabBtn.click();
                renderAnnouncements();
                
                // Очищаем форму
                if (publishCategory) publishCategory.value = '';
                if (publishTitle) publishTitle.value = '';
                if (publishDescription) publishDescription.value = '';
                uploadedFiles = [];
                if (uploadedPhotos) uploadedPhotos.innerHTML = '';
                if (photoCount) photoCount.textContent = '0';
                
                alert('✅ Объявление опубликовано!');
            });
        }
    }
});