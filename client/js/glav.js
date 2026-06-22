document.addEventListener('DOMContentLoaded', () => {

    const userRole =
        localStorage.getItem('uhome_user_role');

    // Для коменданта и студсовета
    if (
        userRole === 'admin' ||
        userRole === 'studsovet'
    ) {

        document.getElementById(
            'quickActionsSection'
        )?.remove();

        document.getElementById(
            'requestsSection'
        )?.remove();
    }

    // Для мастера
    if (
        userRole === 'master' ||
        userRole === 'Electrick' ||
        userRole === 'Slesar' ||
        userRole === 'Santex'
    ) {

        document.getElementById(
            'quickActionsSection'
        )?.remove();

        document.getElementById(
            'newsSection'
        )?.remove();

        document.getElementById(
            'requestsSection'
        )?.remove();

        const masterSection =
            document.getElementById('masterSection');

        if (masterSection) {
            masterSection.style.display = 'block';
        }
    }

    // =====================================
    // USER NAME
    // =====================================

    const username =
        localStorage.getItem(
            'uhome_user_fullname'
        ) || 'Пользователь';

    document.getElementById('userName')
        .textContent =
            username.split(' ')[0];



    // =====================================
    // NEWS
    // =====================================

    const newsList =
        document.getElementById('newsList');

    let news =
        JSON.parse(
            localStorage.getItem(
                'uhome_news'
            )
        ) || [];

    // последние 3

    news = news.slice(-3).reverse();

    if(news.length === 0){

        newsList.innerHTML = `
            <div class="empty">
                Пока нет новостей
            </div>
        `;

    } else {

        news.forEach(item => {

            newsList.innerHTML += `

                <div class="news-card">

                    <div class="news-title">
                        ${item.title}
                    </div>

                    <div class="news-date">
                        ${item.date}
                    </div>

                </div>

            `;
        });
    }



    // =====================================
    // REQUESTS
    // =====================================

    const requestsList =
        document.getElementById(
            'requestsList'
        );

    let requests =
        JSON.parse(
            localStorage.getItem(
                'uhome_requests'
            )
        ) || [];

    requests = requests.slice(-3).reverse();

    if(requests.length === 0){

        requestsList.innerHTML = `
            <div class="empty">
                У вас пока нет заявок
            </div>
        `;

    } else {

        requests.forEach(req => {

            let statusClass = 'waiting';

            if(req.status === 'Скоро приду')
                statusClass = 'arriving';

            if(req.status === 'Работа выполнена')
                statusClass = 'done';

            requestsList.innerHTML += `

                <div class="request-card">

                    <div class="request-title">
                        ${req.title}
                    </div>

                    <div>
                        ${req.category || ''}
                    </div>

                    <div class="
                        request-status
                        ${statusClass}
                    ">
                        ${req.status || 'Ожидает'}
                    </div>

                </div>

            `;
        });
    }

});