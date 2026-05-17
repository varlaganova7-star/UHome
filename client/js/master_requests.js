document.addEventListener('DOMContentLoaded', () => {

    // =========================
    // MENU
    // =========================

    const menuBtn =
        document.getElementById('menuBtn');

    const sideMenu =
        document.getElementById('sideMenu');

    const menuClose =
        document.getElementById('menuClose');

    const menuOverlay =
        document.getElementById('sideMenuOverlay');

    menuBtn.addEventListener('click', () => {

        sideMenu.classList.add('active');

        document.body.style.overflow = 'hidden';

    });

    function closeMenu(){

        sideMenu.classList.remove('active');

        document.body.style.overflow = '';

    }

    menuClose.addEventListener('click', closeMenu);

    menuOverlay.addEventListener('click', closeMenu);

    // =========================
    // REQUESTS
    // =========================

    let requests =
        JSON.parse(localStorage.getItem('repair_requests')) || [];

    // ТЕСТОВЫЕ ДАННЫЕ

    if(requests.length === 0){

        requests = [

            {
                id:1,

                title:'Не работает розетка',

                category:'Электрика',

                room:'312',

                student:'Петрова А.Ф.',

                date:'12.04.2026',

                visit:'13.04.2026, 14:00 - 18:00',

                status:'Ожидают',

                details:'Розетка искрит.'
            },

            {
                id:2,

                title:'Протекает кран',

                category:'Сантехника',

                room:'215',

                student:'Соколов Д.Г.',

                date:'12.04.2026',

                visit:'14.04.2026, 09:00 - 18:00',

                status:'Ожидают',

                details:'Постоянно капает вода.'
            }
        ];
    }

    const requestsContainer =
        document.getElementById('requestsContainer');

    const categoryFilter =
        document.getElementById('categoryFilter');

    const filterButtons =
        document.querySelectorAll('.filter-btn');

    let currentFilter = 'all';

    // =========================
    // RENDER
    // =========================

    function renderRequests(list){

        requestsContainer.innerHTML = '';

        if(list.length === 0){

            requestsContainer.innerHTML = `

                <div class="empty-block">

                    Заявок пока нет

                </div>

            `;

            return;
        }

        list.forEach(request => {

            const card =
                document.createElement('div');

            card.className = 'request-card';

            card.innerHTML = `

                <div class="request-top">

                    <div>

                        <div class="request-title">

                            ${request.title}

                            <span class="request-date">

                                ${request.date}

                            </span>

                        </div>

                        <div class="request-info">

                            <div>
                                🔧 ${request.category}
                            </div>

                            <div>
                                🏠 ${request.room}
                                ${request.student}
                            </div>

                            <div>
                                🗓 ${request.visit}
                            </div>

                        </div>

                    </div>

                    <div class="request-status
                        ${request.status === 'Выполнено' ? 'done' : ''}
                        ${request.status === 'Перенесено' ? 'transfer' : ''}
                        ${request.status === 'Нет деталей' ? 'problem' : ''}
                        ${request.status === 'Скоро приду' ? 'arriving-status' : ''}
                        ${request.status === 'Ожидают' ? 'waiting' : ''}">

                        ${request.status}

                    </div>

                </div>

                <div class="details-toggle">

                    ▾ Показать детали

                </div>

                <div class="request-details">

                    <div class="detail-title">

                        Полное описание

                    </div>

                    <div class="detail-text">

                        ${request.details}

                    </div>

                    <div class="detail-title photos-title">

                        Фотографии проблемы

                    </div>

                    <div class="photo-list">

                        <div class="photo-box"></div>

                        <div class="photo-box"></div>

                    </div>

                </div>

                <div class="actions">

                    <div class="actions-title">

                        Изменить статус заявки:

                    </div>

                    <div class="actions-grid">

                        <button class="action-btn arriving-btn">

                            👷 Скоро приду

                        </button>

                        <button class="action-btn transfer-btn">

                            📅 Нужно перенести

                        </button>

                        <button class="action-btn no-details-btn">

                            🔧 Нет деталей

                        </button>

                        <button class="action-btn done-btn">

                            ✅ Работа выполнена

                        </button>

                    </div>

                </div>

            `;

            // =========================
            // DETAILS
            // =========================

            const toggle =
                card.querySelector('.details-toggle');

            const details =
                card.querySelector('.request-details');

            toggle.addEventListener('click', () => {

                details.classList.toggle('active');

                if(details.classList.contains('active')){

                    toggle.innerHTML =
                        '▴ Скрыть детали';

                } else {

                    toggle.innerHTML =
                        '▾ Показать детали';
                }

            });

            // =========================
            // BUTTONS
            // =========================

            const doneBtn =
                card.querySelector('.done-btn');

            const arrivingBtn =
                card.querySelector('.arriving-btn');

            const transferBtn =
                card.querySelector('.transfer-btn');

            const noDetailsBtn =
                card.querySelector('.no-details-btn');

            // ВЫПОЛНЕНО

            doneBtn.addEventListener('click', () => {

                request.status = 'Выполнено';

                localStorage.setItem(
                    'repair_requests',
                    JSON.stringify(requests)
                );

                applyFilters();

            });

            // СКОРО ПРИДУ

            arrivingBtn.addEventListener('click', () => {

                request.status = 'Скоро приду';

                localStorage.setItem(
                    'repair_requests',
                    JSON.stringify(requests)
                );

                applyFilters();

            });

            // ПЕРЕНЕСТИ

            transferBtn.addEventListener('click', () => {

                request.status = 'Перенесено';

                localStorage.setItem(
                    'repair_requests',
                    JSON.stringify(requests)
                );

                applyFilters();

            });

            // НЕТ ДЕТАЛЕЙ

            noDetailsBtn.addEventListener('click', () => {

                request.status = 'Нет деталей';

                localStorage.setItem(
                    'repair_requests',
                    JSON.stringify(requests)
                );

                applyFilters();

            });

            requestsContainer.appendChild(card);

        });

    }

    // =========================
    // FILTERS
    // =========================

    function applyFilters(){

        let filtered = [...requests];

        // CATEGORY

        const category =
            categoryFilter.value;

        if(category !== 'all'){

            filtered =
                filtered.filter(item =>
                    item.category === category
                );
        }

        // STATUS

        if(currentFilter === 'waiting'){

            filtered =
                filtered.filter(item =>
                    item.status === 'Ожидают'
                );
        }

        if(currentFilter === 'done'){

            filtered =
                filtered.filter(item =>
                    item.status === 'Выполнено'
                );
        }

        renderRequests(filtered);

    }

    // CATEGORY FILTER

    categoryFilter.addEventListener(
        'change',
        applyFilters
    );

    // TOP FILTER BUTTONS

    filterButtons.forEach(button => {

        button.addEventListener('click', () => {

            filterButtons.forEach(btn =>
                btn.classList.remove('active')
            );

            button.classList.add('active');

            currentFilter =
                button.dataset.filter;

            applyFilters();

        });

    });

    // START

    applyFilters();

});