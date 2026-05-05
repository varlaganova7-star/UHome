document.addEventListener('DOMContentLoaded', () => {
    
    // ===== 1. ЧТЕНИЕ РОЛИ =====
    const userRole = localStorage.getItem('uhome_user_role') || 'student';
    console.log(`💬 Чат: роль "${userRole}"`);

    // ===== 2. ЭЛЕМЕНТЫ DOM =====
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const messagesContainer = document.getElementById('messagesContainer');
    const chatArea = document.getElementById('chatArea');
    
    // Элементы для загрузки файлов
    const attachBtn = document.getElementById('attachBtn');
    const fileInput = document.getElementById('fileInput');
    const filePreview = document.getElementById('filePreview');
    const previewContainer = document.getElementById('previewContainer');
    const clearPreview = document.getElementById('clearPreview');

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

    // Состояние загрузки файлов
    let selectedFiles = [];

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
        { id: 1, text: 'Здравствуйте! У меня проблема с горячей водой в комнате 333. Когда будет устранение?', sender: 'user', time: '14:32', date: 'Сегодня' },
        { id: 2, text: 'Добрый день! Заявку приняли. Мастер придёт в течение 2 часов. Пожалуйста, обеспечьте доступ в комнату.', sender: 'admin', time: '14:45', date: 'Сегодня' },
        { id: 3, text: 'Спасибо! Буду ждать. Также хотел уточнить насчёт графика работы прачечной.', sender: 'user', time: '14:48', date: 'Сегодня' }
    ];

    // ===== 5. ЗАГРУЗКА/СОХРАНЕНИЕ СООБЩЕНИЙ =====
    function loadMessages() {
        const saved = localStorage.getItem(`uhome_chat_${userRole}`);
        return saved ? JSON.parse(saved) : defaultMessages;
    }

    function saveMessages(messages) {
        localStorage.setItem(`uhome_chat_${userRole}`, JSON.stringify(messages));
    }

    // ===== 6. ВРЕМЯ И ПРОКРУТКА =====
    function getCurrentTime() {
        const now = new Date();
        return `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
    }

    function scrollToBottom() {
        if (chatArea) setTimeout(() => { chatArea.scrollTop = chatArea.scrollHeight; }, 100);
    }

    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' Б';
        if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + ' КБ';
        return (bytes/(1024*1024)).toFixed(1) + ' МБ';
    }

    // ===== 7. ЛАЙТБОКС ДЛЯ ФОТО =====
    function openLightbox(imageUrl) {
        if (!imageUrl) return;
        let lightbox = document.querySelector('.lightbox');
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `<button class="lightbox-close">&times;</button><img src="" alt="Preview">`;
            document.body.appendChild(lightbox);
            lightbox.querySelector('.lightbox-close').onclick = () => lightbox.classList.remove('active');
            lightbox.onclick = (e) => { if (e.target === lightbox) lightbox.classList.remove('active'); };
        }
        lightbox.querySelector('img').src = imageUrl;
        lightbox.classList.add('active');
    }

    // ===== 8. ОТРИСОВКА СООБЩЕНИЙ =====
    function renderMessages(messages) {
        if (!messagesContainer) return;
        let html = '', lastDate = '';
        messages.forEach(msg => {
            if (msg.date && msg.date !== lastDate) {
                html += `<div class="date-divider"><span>${msg.date}</span></div>`;
                lastDate = msg.date;
            }
            const direction = msg.sender === 'user' ? 'outgoing' : 'incoming';
            let mediaHtml = '';
            if (msg.media?.length) {
                mediaHtml = '<div class="media-container">';
                const images = msg.media.filter(m => m.type === 'image');
                const videos = msg.media.filter(m => m.type === 'video');
                if (images.length > 1) {
                    mediaHtml += '<div class="media-grid">';
                    images.forEach(item => {
                        mediaHtml += `<div class="media-item" onclick="openLightbox('${item.dataUrl||''}')"><img src="${item.dataUrl||'placeholder.jpg'}" alt="${item.name}" loading="lazy"></div>`;
                    });
                    mediaHtml += '</div>';
                } else {
                    images.forEach(item => {
                        mediaHtml += `<div class="media-item" onclick="openLightbox('${item.dataUrl||''}')"><img src="${item.dataUrl||'placeholder.jpg'}" alt="${item.name}" loading="lazy"></div>`;
                    });
                }
                videos.forEach(item => {
                    mediaHtml += `
                        <div class="media-item">
                            <div class="video-placeholder" onclick="this.innerHTML='<video src=&quot;${item.dataUrl||''}&quot; controls autoplay></video>'">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                            </div>
                            <div class="file-info">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                                <div class="file-details"><div class="file-name">${item.name}</div><div class="file-size">${item.size}</div></div>
                            </div>
                        </div>`;
                });
                mediaHtml += '</div>';
            }
            html += `<div class="message ${direction}">${msg.text ? `<div>${msg.text}</div>` : ''}${mediaHtml}<div class="message-time">${msg.time}</div></div>`;
        });
        messagesContainer.innerHTML = html;
        scrollToBottom();
    }

    // ===== 9. ПРЕВЬЮ ФАЙЛОВ =====
    function addFilePreview(file) {
        if (!previewContainer) return;
        const previewItem = document.createElement('div');
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        previewItem.className = `file-preview-item ${isImage ? 'image' : isVideo ? 'video' : ''}`;
        const reader = new FileReader();
        reader.onload = (e) => {
            if (isImage) {
                previewItem.innerHTML = `<img src="${e.target.result}" alt="${file.name}"><div class="file-name">${file.name}</div><button class="remove-file" data-idx="${selectedFiles.indexOf(file)}">&times;</button>`;
            } else if (isVideo) {
                previewItem.innerHTML = `<video src="${e.target.result}"></video><div class="file-name">${file.name}</div><button class="remove-file" data-idx="${selectedFiles.indexOf(file)}">&times;</button>`;
            }
            previewContainer.appendChild(previewItem);
        };
        reader.readAsDataURL(file);
    }

    // ===== 10. ОТПРАВКА СООБЩЕНИЯ С МЕДИА =====
    function sendMediaMessage() {
        if (!selectedFiles.length) return;
        const text = chatInput?.value.trim() || '';
        const messages = loadMessages();
        const mediaItems = selectedFiles.map(file => ({
            type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'file',
            name: file.name,
            size: formatFileSize(file.size),
            dataUrl: file._dataUrl
        }));
        messages.push({ id: Date.now(), text, media: mediaItems, sender: 'user', time: getCurrentTime(), date: 'Сегодня' });
        saveMessages(messages);
        renderMessages(messages);
        if (chatInput) chatInput.value = '';
        selectedFiles = [];
        if (previewContainer) previewContainer.innerHTML = '';
        if (filePreview) filePreview.style.display = 'none';
        setTimeout(() => {
            const resp = ['Фото получены!', 'Принял. Разберёмся.', 'Материалы загрузились.'][Math.floor(Math.random()*3)];
            messages.push({ id: Date.now()+1, text: resp, sender: 'admin', time: getCurrentTime(), date: 'Сегодня' });
            saveMessages(messages);
            renderMessages(messages);
        }, 1500);
    }

    // ===== 11. ОТПРАВКА ТЕКСТОВОГО СООБЩЕНИЯ =====
    function sendMessage() {
        const text = chatInput?.value.trim();
        if (!text) return;
        const messages = loadMessages();
        messages.push({ id: Date.now(), text, sender: 'user', time: getCurrentTime(), date: 'Сегодня' });
        saveMessages(messages);
        renderMessages(messages);
        if (chatInput) { chatInput.value = ''; chatInput.focus(); }
        setTimeout(() => {
            const resp = ['Спасибо за обращение!', 'Понял вас.', 'Заявка принята.'][Math.floor(Math.random()*3)];
            messages.push({ id: Date.now()+1, text: resp, sender: 'admin', time: getCurrentTime(), date: 'Сегодня' });
            saveMessages(messages);
            renderMessages(messages);
        }, 1000 + Math.random()*1500);
    }

    // ===== 12. ОБРАБОТЧИКИ СОБЫТИЙ =====
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files || []);
            if (!files.length) return;
            const remaining = 5 - selectedFiles.length;
            files.slice(0, remaining).forEach(file => {
                if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
                    const reader = new FileReader();
                    reader.onload = (ev) => { file._dataUrl = ev.target.result; };
                    reader.readAsDataURL(file);
                    selectedFiles.push(file);
                    addFilePreview(file);
                }
            });
            if (selectedFiles.length && filePreview) filePreview.style.display = 'block';
            fileInput.value = '';
        });
    }

    if (previewContainer) {
        previewContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-file')) {
                const idx = parseInt(e.target.dataset.idx);
                selectedFiles.splice(idx, 1);
                previewContainer.innerHTML = '';
                selectedFiles.forEach((file, i) => {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        const item = document.createElement('div');
                        const isImg = file.type.startsWith('image/');
                        item.className = `file-preview-item ${isImg ? 'image' : 'video'}`;
                        item.innerHTML = isImg 
                            ? `<img src="${ev.target.result}"><div class="file-name">${file.name}</div><button class="remove-file" data-idx="${i}">&times;</button>`
                            : `<video src="${ev.target.result}"></video><div class="file-name">${file.name}</div><button class="remove-file" data-idx="${i}">&times;</button>`;
                        previewContainer.appendChild(item);
                    };
                    reader.readAsDataURL(file);
                });
                if (!selectedFiles.length && filePreview) filePreview.style.display = 'none';
            }
        });
    }

    if (clearPreview) {
        clearPreview.addEventListener('click', () => {
            selectedFiles = [];
            if (previewContainer) previewContainer.innerHTML = '';
            if (filePreview) filePreview.style.display = 'none';
        });
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            selectedFiles.length ? sendMediaMessage() : sendMessage();
        });
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                selectedFiles.length ? sendMediaMessage() : sendMessage();
            }
        });
    }

    // ===== 13. БОКОВОЕ МЕНЮ (ВАШ ВАРИАНТ) =====
    function updateMenu() {
        if (!menuNav) return;
        
        const menuItems = {
            student: [
                { label: 'Главная', icon: 'home', href: 'glav.html' },
                { label: 'Подача заявки на ремонт', icon: 'wrench', href: '#' },
                { label: 'Отслеживание статуса заявки', icon: 'clipboard', href: '#' },
                { label: 'Объявления и новости', icon: 'news', href: 'news.html' },
                { label: 'Чат с администрацией', icon: 'chat', href: 'chat.html', active: true },
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
                { label: 'Чат с администрацией', icon: 'chat', href: 'chat.html', active: true },
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

    // ===== 14. ПРОФИЛЬ И МЕНЮ =====
    if (menuAvatar) menuAvatar.src = user.avatar;
    if (menuUserName) menuUserName.textContent = user.name;
    if (menuUserRole) menuUserRole.textContent = user.role;

    function openMenu() { sideMenu?.classList.add('active'); document.body.style.overflow = 'hidden'; }
    function closeMenu() { sideMenu?.classList.remove('active'); document.body.style.overflow = ''; }
    
    if (menuBtn) menuBtn.addEventListener('click', openMenu);
    if (menuClose) menuClose.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

    if (userProfileBlock) {
        userProfileBlock.style.cursor = 'pointer';
        userProfileBlock.addEventListener('click', () => {
            closeMenu();
            setTimeout(() => { window.location.href = 'profile.html'; }, 300);
        });
    }

    if (menuNav) {
        menuNav.addEventListener('click', (e) => {
            const link = e.target.closest('.menu-nav-link');
            if (link) closeMenu();
        });
    }

    // ===== 15. ИНИЦИАЛИЗАЦИЯ =====
    const messages = loadMessages();
    renderMessages(messages);
    console.log('✅ Чат загружен');
});