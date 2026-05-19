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

        studentRequests.forEach((request, index) => {

            const isHistory =
                request.status === 'Выполнено';

            const card = document.createElement('div');

            card.className = 'request-card';

            card.style.animationDelay =
               `${index * 0.08}s`;

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

                    if (!request.history) {
                        request.history = [];
                    }
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