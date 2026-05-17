// student_requests.js

document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // ROLE
    // =========================================

    const userRole =
        localStorage.getItem('uhome_user_role') || 'student';

    // =========================================
    // USERS
    // =========================================

    const users = {

        student: {
            name: 'Игорь Иванов',
            role: 'Студент',
            avatar:
                'https://ui-avatars.com/api/?name=Игорь+Иванов&background=F47920&color=fff&size=300'
        }

    };

    const user = users[userRole] || users.student;

    // =========================================
    // MENU
    // =========================================

    const menuBtn = document.getElementById('menuBtn');
    const sideMenu = document.getElementById('sideMenu');
    const menuClose = document.getElementById('menuClose');
    const menuOverlay =
        document.getElementById('sideMenuOverlay');

    const menuNav = document.getElementById('menuNav');

    const menuAvatar =
        document.getElementById('menuAvatar');

    const menuUserName =
        document.getElementById('menuUserName');

    const menuUserRole =
        document.getElementById('menuUserRole');

    menuAvatar.src = user.avatar;
    menuUserName.textContent = user.name;
    menuUserRole.textContent = user.role;

    // =========================================
    // MENU ITEMS
    // =========================================
function updateMenu() {

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
                href: 'student_requests.html',
                active: true
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
                href: 'guest_registration.html'
            },

            {
                label: 'Подбор соседа',
                icon: 'neighbor',
                href: 'neighbor.html'
            }
        ]
    };

    const icons = {

        home:
            '<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"/></svg>',

        wrench:
            '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',

        clipboard:
            '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',

        news:
            '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7"/></svg>',

        chat:
            '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',

        check:
            '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/></svg>',

        guest:
            '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="7" r="4"/></svg>',

        neighbor:
            '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="7" r="4"/></svg>'
    };

    const items = menuItems[userRole] || menuItems.student;

    let html = '';

    items.forEach(item => {

        const isActive = item.active ? 'active' : '';

        const svgIcon =
            icons[item.icon] || icons.home;

        html += `
            <a href="${item.href}"
               class="menu-nav-link ${isActive}">

                ${svgIcon}

                <span>${item.label}</span>

            </a>
        `;
    });

    menuNav.innerHTML = html;
}

updateMenu();
    // =========================================
    // MENU OPEN/CLOSE
    // =========================================

    function openMenu(){

        sideMenu.classList.add('active');

        document.body.style.overflow = 'hidden';
    }

    function closeMenu(){

        sideMenu.classList.remove('active');

        document.body.style.overflow = '';
    }

    menuBtn.addEventListener('click', openMenu);

    menuClose.addEventListener('click', closeMenu);

    menuOverlay.addEventListener('click', closeMenu);

    // =========================================
    // REQUESTS
    // =========================================

    const activeContainer =
        document.getElementById('activeRequests');

    const historyContainer =
        document.getElementById('historyRequests');

    const requests =
        JSON.parse(
            localStorage.getItem('repairRequests')
        ) || [];

    const studentRequests = requests.filter(
        request => request.studentName === user.name
    );

    renderRequests();

    // =========================================
    // RENDER
    // =========================================

    function renderRequests(){

        activeContainer.innerHTML = '';
        historyContainer.innerHTML = '';

        if(!studentRequests.length){

            activeContainer.innerHTML = `
                <div class="request-card">
                    Заявок пока нет
                </div>
            `;

            return;
        }

        studentRequests.forEach(request => {

            const isHistory =
                request.status === 'Выполнено';

            const card = document.createElement('div');

            card.className = 'request-card';

            let statusClass = 'pending';

            if(request.status === 'Скоро приду'){
                statusClass = 'soon';
            }

            if(request.status === 'Выполнено'){
                statusClass = 'done';
            }

            if(request.status === 'Нужно перенести'){
                statusClass = 'transfer';
            }

            if(request.status === 'Нет деталей'){
                statusClass = 'details';
            }

            card.innerHTML = `

                <div class="request-top">

                    <div>

                        <div class="request-title">
                            ${request.shortDescription}
                        </div>

                        <div class="request-category">
                            ${request.category}
                        </div>

                        <div class="request-date">
                            ${request.createdAt}
                        </div>

                    </div>

                    <div class="status ${statusClass}">
                        ${request.status}
                    </div>

                </div>

                <div class="request-description">
                    ${request.fullDescription || 'Описание отсутствует'}
                </div>

                <div class="request-actions">

                    <button
                        class="action-btn edit-btn"
                        data-id="${request.id}"
                    >
                        Редактировать
                    </button>

                    <button
                        class="action-btn delete-btn"
                        data-id="${request.id}"
                    >
                        Удалить
                    </button>

                </div>

                <div class="history-block">

                    ${
                        request.history
                        ?.map(item => `
                            <div class="history-item">
                                <div>${item.status}</div>
                                <span>${item.date}</span>
                            </div>
                        `)
                        .join('')
                    }

                </div>

            `;

            if(isHistory){

                historyContainer.appendChild(card);

            }else{

                activeContainer.appendChild(card);

            }

        });

        initButtons();
    }

    // =========================================
    // BUTTONS
    // =========================================

    function initButtons(){

        // DELETE

        document.querySelectorAll('.delete-btn')
            .forEach(btn => {

                btn.addEventListener('click', () => {

                    const id = Number(btn.dataset.id);

                    let requests =
                        JSON.parse(
                            localStorage.getItem('repairRequests')
                        ) || [];

                    requests = requests.filter(
                        request => request.id !== id
                    );

                    localStorage.setItem(
                        'repairRequests',
                        JSON.stringify(requests)
                    );

                    location.reload();

                });

            });

        // EDIT

        document.querySelectorAll('.edit-btn')
            .forEach(btn => {

                btn.addEventListener('click', () => {

                    const id = Number(btn.dataset.id);

                    let requests =
                        JSON.parse(
                            localStorage.getItem('repairRequests')
                        ) || [];

                    const request = requests.find(
                        item => item.id === id
                    );

                    const newText = prompt(
                        'Изменить описание:',
                        request.shortDescription
                    );

                    if(!newText) return;

                    request.shortDescription = newText;

                    request.history.push({

                        status:'Заявка изменена',

                        date:new Date().toLocaleString()

                    });

                    localStorage.setItem(
                        'repairRequests',
                        JSON.stringify(requests)
                    );

                    location.reload();

                });

            });

    }

});