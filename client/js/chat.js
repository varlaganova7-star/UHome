document.addEventListener('DOMContentLoaded', () => {

    // ===== 1. ЧТЕНИЕ РОЛИ =====
    const userRole = localStorage.getItem('uhome_user_role') || 'student';
    console.log(`💬 Чат: роль "${userRole}"`);

    // ===== 2. ЭЛЕМЕНТЫ DOM =====
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const messagesContainer = document.getElementById('messagesContainer');
    const chatArea = document.getElementById('chatArea');

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

    // ===== 4. ПРИМЕРЫ СООБЩЕНИЙ =====
    const defaultMessages = [
        {
            id: 1,
            text: 'Здравствуйте! У меня проблема с горячей водой в комнате 333. Когда будет устранение?',
            sender: 'user',
            time: '14:32',
            date: 'Сегодня'
        },
        {
            id: 2,
            text: 'Добрый день! Заявку приняли. Мастер придёт в течение 2 часов. Пожалуйста, обеспечьте доступ в комнату.',
            sender: 'admin',
            time: '14:45',
            date: 'Сегодня'
        },
        {
            id: 3,
            text: 'Спасибо! Буду ждать. Также хотел уточнить насчёт графика работы прачечной.',
            sender: 'user',
            time: '14:48',
            date: 'Сегодня'
        }
    ];

    // ===== 5. ЗАГРУЗКА СООБЩЕНИЙ =====
    function loadMessages() {
        // Проверяем сохранённые сообщения в localStorage
        const saved = localStorage.getItem(`uhome_chat_${userRole}`);

        if (saved) {
            return JSON.parse(saved);
        }

        // Возвращаем дефолтные сообщения
        return defaultMessages;
    }

    // ===== 6. СОХРАНЕНИЕ СООБЩЕНИЙ =====
    function saveMessages(messages) {
        localStorage.setItem(`uhome_chat_${userRole}`, JSON.stringify(messages));
    }

    // ===== 7. ОТРИСОВКА СООБЩЕНИЙ =====
    function renderMessages(messages) {
        if (!messagesContainer) return;

        let html = '';
        let lastDate = '';

        messages.forEach(msg => {
            // Дата-разделитель
            if (msg.date && msg.date !== lastDate) {
                html += `<div class="date-divider"><span>${msg.date}</span></div>`;
                lastDate = msg.date;
            }

            const direction = msg.sender === 'user' ? 'outgoing' : 'incoming';
            html += `
                <div class="message ${direction}">
                    ${msg.text}
                    <div class="message-time">${msg.time}</div>
                </div>
            `;
        });

        messagesContainer.innerHTML = html;
        scrollToBottom();
    }

    // ===== 8. ПРОКРУТКА ВНИЗ =====
    function scrollToBottom() {
        if (chatArea) {
            setTimeout(() => {
                chatArea.scrollTop = chatArea.scrollHeight;
            }, 100);
        }
    }

    // ===== 9. ТЕКУЩЕЕ ВРЕМЯ =====
    function getCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    // ===== 10. ОТПРАВКА СООБЩЕНИЯ =====
    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        const messages = loadMessages();
        const newMessage = {
            id: Date.now(),
            text: text,
            sender: 'user',
            time: getCurrentTime(),
            date: 'Сегодня'
        };

        messages.push(newMessage);
        saveMessages(messages);

        renderMessages(messages);
        chatInput.value = '';
        chatInput.focus();

        // Имитация ответа администратора (через 1-2 секунды)
        setTimeout(() => {
            const responses = [
                'Спасибо за обращение! Мы рассмотрим вашу заявку.',
                'Понял вас. Передам информацию ответственному лицу.',
                'Благодарим за обратную связь! Постараемся решить вопрос в ближайшее время.',
                'Заявка принята. Ожидайте ответа в течение рабочего дня.',
                'Хорошо, зафиксирую. Мастер свяжется с вами.'
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];

            const adminMessage = {
                id: Date.now() + 1,
                text: randomResponse,
                sender: 'admin',
                time: getCurrentTime(),
                date: 'Сегодня'
            };

            messages.push(adminMessage);
            saveMessages(messages);
            renderMessages(messages);
        }, 1000 + Math.random() * 1500);
    }

    // ===== 11. ОБРАБОТЧИКИ СОБЫТИЙ =====

    // Кнопка отправки
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    // Отправка по Enter
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // ===== 12. БОКОВОЕ МЕНЮ =====
    function updateMenu() {
        if (!menuNav) return;

        const menuItems = {
            student: [
                { label: 'Главная', icon: 'home', href: 'glav.html' },
                { label: 'Чат с администрацией', icon: 'chat', href: 'chat.html', active: true },
                { label: 'Подбор соседа', icon: 'neighbor', href: 'neighbor.html' }
            ],
            admin: [
                { label: 'Главная', icon: 'home', href: 'glav.html' },
                { label: 'Чаты со студентами', icon: 'chat', href: 'chat.html', active: true }
            ],
            Studsovet: [
                { label: 'Главная', icon: 'home', href: 'glav.html' },
                { label: 'Чат с администрацией', icon: 'chat', href: 'chat.html', active: true },
                { label: 'Подбор соседа', icon: 'neighbor', href: 'neighbor.html' }
            ],
            Electrick: [
                { label: 'Главная', icon: 'home', href: 'glav.html' },
                { label: 'Чат с администрацией', icon: 'chat', href: 'chat.html', active: true }
            ],
            Slesar: [
                { label: 'Главная', icon: 'home', href: 'glav.html' },
                { label: 'Чат с администрацией', icon: 'chat', href: 'chat.html', active: true }
            ],
            Santex: [
                { label: 'Главная', icon: 'home', href: 'glav.html' },
                { label: 'Чат с администрацией', icon: 'chat', href: 'chat.html', active: true }
            ]
        };

        const icons = {
            home: '<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"/></svg>',
            chat: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
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

    // ===== 13. ИНИЦИАЛИЗАЦИЯ =====
    const messages = loadMessages();
    renderMessages(messages);

    console.log('✅ Чат загружен');
}); document.addEventListener('DOMContentLoaded', () => {

    // ===== 1. ЧТЕНИЕ РОЛИ =====
    const userRole = localStorage.getItem('uhome_user_role') || 'student';
    console.log(`💬 Чат: роль "${userRole}"`);

    // ===== 2. ЭЛЕМЕНТЫ DOM =====
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const messagesContainer = document.getElementById('messagesContainer');
    const chatArea = document.getElementById('chatArea');

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

    // ===== 4. ПРИМЕРЫ СООБЩЕНИЙ =====
    const defaultMessages = [
        {
            id: 1,
            text: 'Здравствуйте! У меня проблема с горячей водой в комнате 333. Когда будет устранение?',
            sender: 'user',
            time: '14:32',
            date: 'Сегодня'
        },
        {
            id: 2,
            text: 'Добрый день! Заявку приняли. Мастер придёт в течение 2 часов. Пожалуйста, обеспечьте доступ в комнату.',
            sender: 'admin',
            time: '14:45',
            date: 'Сегодня'
        },
        {
            id: 3,
            text: 'Спасибо! Буду ждать. Также хотел уточнить насчёт графика работы прачечной.',
            sender: 'user',
            time: '14:48',
            date: 'Сегодня'
        }
    ];

    // ===== 5. ЗАГРУЗКА СООБЩЕНИЙ =====
    function loadMessages() {
        // Проверяем сохранённые сообщения в localStorage
        const saved = localStorage.getItem(`uhome_chat_${userRole}`);

        if (saved) {
            return JSON.parse(saved);
        }

        // Возвращаем дефолтные сообщения
        return defaultMessages;
    }

    // ===== 6. СОХРАНЕНИЕ СООБЩЕНИЙ =====
    function saveMessages(messages) {
        localStorage.setItem(`uhome_chat_${userRole}`, JSON.stringify(messages));
    }

    // ===== 7. ОТРИСОВКА СООБЩЕНИЙ (ОБНОВЛЁННАЯ) =====
    function renderMessages(messages) {
        if (!messagesContainer) return;

        let html = '';
        let lastDate = '';

        messages.forEach(msg => {
            // Дата-разделитель
            if (msg.date && msg.date !== lastDate) {
                html += `<div class="date-divider"><span>${msg.date}</span></div>`;
                lastDate = msg.date;
            }

            const direction = msg.sender === 'user' ? 'outgoing' : 'incoming';

            let mediaHtml = '';
            if (msg.media && msg.media.length > 0) {
                mediaHtml = '<div class="media-container">';

                // Если несколько изображений - сетка
                const images = msg.media.filter(m => m.type === 'image');
                const videos = msg.media.filter(m => m.type === 'video');

                if (images.length > 1) {
                    mediaHtml += '<div class="media-grid">';
                    images.forEach((item, index) => {
                        mediaHtml += `
                            <div class="media-item" onclick="openLightbox('${item.dataUrl || ''}', ${index})">
                                <img src="${item.dataUrl || 'placeholder.jpg'}" alt="${item.name}" loading="lazy">
                            </div>
                        `;
                    });
                    mediaHtml += '</div>';
                } else {
                    // Одиночные изображения
                    images.forEach(item => {
                        mediaHtml += `
                            <div class="media-item" onclick="openLightbox('${item.dataUrl || ''}')">
                                <img src="${item.dataUrl || 'placeholder.jpg'}" alt="${item.name}" loading="lazy">
                            </div>
                        `;
                    });
                }

                // Видео
                videos.forEach(item => {
                    mediaHtml += `
                        <div class="media-item">
                            <div class="video-placeholder" onclick="this.innerHTML='<video src=&quot;${item.dataUrl || ''}&quot; controls autoplay></video>'">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polygon points="5 3 19 12 5 21 5 3"/>
                                </svg>
                            </div>
                            <div class="file-info">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polygon points="23 7 16 12 23 17 23 7"/>
                                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                                </svg>
                                <div class="file-details">
                                    <div class="file-name">${item.name}</div>
                                    <div class="file-size">${item.size}</div>
                                </div>
                            </div>
                        </div>
                    `;
                });

                mediaHtml += '</div>';
            }

            html += `
                <div class="message ${direction}">
                    ${msg.text ? `<div>${msg.text}</div>` : ''}
                    ${mediaHtml}
                    <div class="message-time">${msg.time}</div>
                </div>
            `;
        });

        messagesContainer.innerHTML = html;
        scrollToBottom();
    }

    // ===== 7b. ЛАЙТБОКС ДЛЯ ПРОСМОТРА ИЗОБРАЖЕНИЙ =====
    function openLightbox(imageUrl, index = 0) {
        if (!imageUrl) return;

        let lightbox = document.querySelector('.lightbox');
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <button class="lightbox-close">&times;</button>
                <img src="" alt="Preview">
            `;
            document.body.appendChild(lightbox);

            lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
                lightbox.classList.remove('active');
            });

            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    lightbox.classList.remove('active');
                }
            });
        }

        lightbox.querySelector('img').src = imageUrl;
        lightbox.classList.add('active');
    }

    // ===== 8. ПРОКРУТКА ВНИЗ =====
    function scrollToBottom() {
        if (chatArea) {
            setTimeout(() => {
                chatArea.scrollTop = chatArea.scrollHeight;
            }, 100);
        }
    }

    // ===== 9. ТЕКУЩЕЕ ВРЕМЯ =====
    function getCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    // ===== 9b. ОБРАБОТКА ВЫБОРА ФАЙЛОВ =====
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            if (files.length === 0) return;

            // Ограничение: максимум 5 файлов за раз
            const remaining = 5 - selectedFiles.length;
            const filesToAdd = files.slice(0, remaining);

            filesToAdd.forEach(file => {
                // Проверка типа файла
                if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
                    selectedFiles.push(file);
                    addFilePreview(file);
                }
            });

            // Показываем превью
            if (selectedFiles.length > 0 && filePreview) {
                filePreview.style.display = 'block';
            }

            // Очищаем input, чтобы можно было выбрать тот же файл снова
            fileInput.value = '';
        });
    }

    // Добавление превью файла
    function addFilePreview(file) {
        if (!previewContainer) return;

        const previewItem = document.createElement('div');
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');

        previewItem.className = `file-preview-item ${isImage ? 'image' : isVideo ? 'video' : ''}`;

        const reader = new FileReader();

        reader.onload = (e) => {
            if (isImage) {
                previewItem.innerHTML = `
                    <img src="${e.target.result}" alt="${file.name}">
                    <div class="file-name">${file.name}</div>
                    <button class="remove-file" data-index="${selectedFiles.indexOf(file)}">&times;</button>
                `;
            } else if (isVideo) {
                previewItem.innerHTML = `
                    <video src="${e.target.result}"></video>
                    <div class="file-name">${file.name}</div>
                    <button class="remove-file" data-index="${selectedFiles.indexOf(file)}">&times;</button>
                `;
            }

            previewContainer.appendChild(previewItem);
        };

        reader.readAsDataURL(file);
    }

    // Удаление файла из превью
    if (previewContainer) {
        previewContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-file')) {
                const index = parseInt(e.target.dataset.index);
                selectedFiles.splice(index, 1);

                // Перерисовываем превью
                previewContainer.innerHTML = '';
                selectedFiles.forEach((file, idx) => {
                    // Пересоздаём превью с новым индексом
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const previewItem = document.createElement('div');
                        const isImage = file.type.startsWith('image/');
                        const isVideo = file.type.startsWith('video/');

                        previewItem.className = `file-preview-item ${isImage ? 'image' : isVideo ? 'video' : ''}`;

                        if (isImage) {
                            previewItem.innerHTML = `
                                <img src="${e.target.result}" alt="${file.name}">
                                <div class="file-name">${file.name}</div>
                                <button class="remove-file" data-index="${idx}">&times;</button>
                            `;
                        } else if (isVideo) {
                            previewItem.innerHTML = `
                                <video src="${e.target.result}"></video>
                                <div class="file-name">${file.name}</div>
                                <button class="remove-file" data-index="${idx}">&times;</button>
                            `;
                        }

                        previewContainer.appendChild(previewItem);
                    };
                    reader.readAsDataURL(file);
                });

                if (selectedFiles.length === 0 && filePreview) {
                    filePreview.style.display = 'none';
                }
            }
        });
    }

    // Очистка всех файлов
    if (clearPreview) {
        clearPreview.addEventListener('click', () => {
            selectedFiles = [];
            if (previewContainer) previewContainer.innerHTML = '';
            if (filePreview) filePreview.style.display = 'none';
        });
    }

    // ===== 9c. ОТПРАВКА СООБЩЕНИЯ С МЕДИА =====
    function sendMediaMessage() {
        if (selectedFiles.length === 0) return;

        const text = chatInput.value.trim();
        const messages = loadMessages();

        // Создаём сообщение с медиа
        const mediaItems = selectedFiles.map(file => {
            const isImage = file.type.startsWith('image/');
            const isVideo = file.type.startsWith('video/');

            return {
                type: isImage ? 'image' : isVideo ? 'video' : 'file',
                name: file.name,
                size: formatFileSize(file.size),
                mimeType: file.type
            };
        });

        const newMessage = {
            id: Date.now(),
            text: text || '',
            media: mediaItems,
            sender: 'user',
            time: getCurrentTime(),
            date: 'Сегодня'
        };

        messages.push(newMessage);
        saveMessages(messages);
        renderMessages(messages);

        // Очищаем
        chatInput.value = '';
        selectedFiles = [];
        if (previewContainer) previewContainer.innerHTML = '';
        if (filePreview) filePreview.style.display = 'none';

        // Имитация ответа
        setTimeout(() => {
            const responses = [
                'Фото/видео получены! Спасибо.',
                'Принял. Разберёмся с этим.',
                'Материалы загрузились. Спасибо за обращение!'
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];

            const adminMessage = {
                id: Date.now() + 1,
                text: randomResponse,
                sender: 'admin',
                time: getCurrentTime(),
                date: 'Сегодня'
            };

            messages.push(adminMessage);
            saveMessages(messages);
            renderMessages(messages);
        }, 1500);
    }

    // Форматирование размера файла
    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' Б';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' КБ';
        return (bytes / (1024 * 1024)).toFixed(1) + ' МБ';
    }

    // ===== 10. ОТПРАВКА СООБЩЕНИЯ =====
    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        const messages = loadMessages();
        const newMessage = {
            id: Date.now(),
            text: text,
            sender: 'user',
            time: getCurrentTime(),
            date: 'Сегодня'
        };

        messages.push(newMessage);
        saveMessages(messages);

        renderMessages(messages);
        chatInput.value = '';
        chatInput.focus();

        // Имитация ответа администратора (через 1-2 секунды)
        setTimeout(() => {
            const responses = [
                'Спасибо за обращение! Мы рассмотрим вашу заявку.',
                'Понял вас. Передам информацию ответственному лицу.',
                'Благодарим за обратную связь! Постараемся решить вопрос в ближайшее время.',
                'Заявка принята. Ожидайте ответа в течение рабочего дня.',
                'Хорошо, зафиксирую. Мастер свяжется с вами.'
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];

            const adminMessage = {
                id: Date.now() + 1,
                text: randomResponse,
                sender: 'admin',
                time: getCurrentTime(),
                date: 'Сегодня'
            };

            messages.push(adminMessage);
            saveMessages(messages);
            renderMessages(messages);
        }, 1000 + Math.random() * 1500);
    }

    // ===== 11. ОБРАБОТЧИКИ СОБЫТИЙ (ОБНОВЛЁННЫЕ) =====

    // Кнопка отправки
    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            if (selectedFiles.length > 0) {
                sendMediaMessage();
            } else {
                sendMessage();
            }
        });
    }

    // Отправка по Enter
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (selectedFiles.length > 0) {
                    sendMediaMessage();
                } else {
                    sendMessage();
                }
            }
        });
    }
    // ===== 12. БОКОВОЕ МЕНЮ =====
    function updateMenu() {
        if (!menuNav) return;

        const menuItems = {
            student: [
                { label: 'Главная', icon: 'home', href: 'glav.html' },
                { label: 'Подача заявки на ремонт', icon: 'wrench', href: '#' },
                { label: 'Отслеживание статуса заявки', icon: 'clipboard', href: '#' },
                { label: 'Объявления и новости', icon: 'news', href: 'news.html' },
                { label: 'Чаты с администрацией', icon: 'chat', href: 'chat.html', active: true },
                { label: 'Правила проживания', icon: 'check', href: 'rules.html' },
                { label: 'Регистрация гостей', icon: 'guest', href: '#' },
                { label: 'Подбор соседа', icon: 'neighbor', href: 'neighbor.html' }
            ],
            admin: [
                { label: 'Главная', icon: 'home', href: 'glav.html' },
                { label: 'Чаты со студентами', icon: 'chat', href: 'chat.html', active: true },
                { label: 'Подача заявки на ремонт', icon: 'wrench', href: '#' },
                { label: 'Отслеживание статуса заявки', icon: 'clipboard', href: '#' },
                { label: 'Объявления и новости', icon: 'news', href: 'news.html' },
                { label: 'Правила проживания', icon: 'check', href: 'rules.html' },
                { label: 'Регистрация гостей', icon: 'guest', href: '#' },
                { label: 'Подбор соседа', icon: 'neighbor', href: 'neighbor.html' }
            ],
            Studsovet: [
                { label: 'Главная', icon: 'home', href: 'glav.html' },
                { label: 'Подача заявки на ремонт', icon: 'wrench', href: '#' },
                { label: 'Отслеживание статуса заявки', icon: 'clipboard', href: '#' },
                { label: 'Объявления и новости', icon: 'news', href: 'news.html' },
                { label: 'Чаты с администрацией', icon: 'chat', href: 'chat.html', active: true },
                { label: 'Правила проживания', icon: 'check', href: 'rules.html' },
                { label: 'Регистрация гостей', icon: 'guest', href: '#' },
                { label: 'Подбор соседа', icon: 'neighbor', href: 'neighbor.html' }
            ],
            Electrick: [
                { label: 'Главная', icon: 'home', href: 'glav.html' },
                { label: 'Чат с администрацией', icon: 'chat', href: 'chat.html', active: true }
            ],
            Slesar: [
                { label: 'Главная', icon: 'home', href: 'glav.html' },
                { label: 'Чат с администрацией', icon: 'chat', href: 'chat.html', active: true }
            ],
            Santex: [
                { label: 'Главная', icon: 'home', href: 'glav.html' },
                { label: 'Чат с администрацией', icon: 'chat', href: 'chat.html', active: true }
            ]
        };

        const icons = {
            home: '<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"/></svg>',
            chat: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
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
    // ===== 3b. ЭЛЕМЕНТЫ ДЛЯ РАБОТЫ С ФАЙЛАМИ =====
    const attachBtn = document.getElementById('attachBtn');
    const fileInput = document.getElementById('fileInput');
    const filePreview = document.getElementById('filePreview');
    const previewContainer = document.getElementById('previewContainer');
    const clearPreview = document.getElementById('clearPreview');

    let selectedFiles = [];

    // ===== 13. ИНИЦИАЛИЗАЦИЯ =====
    const messages = loadMessages();
    renderMessages(messages);

    console.log('✅ Чат загружен');
});