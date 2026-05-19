// guest_registration.js

document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // INIT LAYOUT
    // =========================================

    if (typeof initLayout === 'function') {
        initLayout({
            page: 'guest_registration'
        });
    }

    // =========================================
    // ELEMENTS
    // =========================================

    const guestName =
        document.getElementById('guestName');

    const guestDocument =
        document.getElementById('guestDocument');

    const guestDate =
        document.getElementById('guestDate');

    const timeFrom =
        document.getElementById('timeFrom');

    const timeTo =
        document.getElementById('timeTo');

    const registerBtn =
        document.getElementById('registerBtn');

    const cancelBtn =
        document.getElementById('cancelBtn');

    const guestHistory =
        document.getElementById('guestHistory');

    // =========================================
    // STORAGE
    // =========================================

    let guests =
        JSON.parse(
            localStorage.getItem('guestHistory')
        ) || [];

    // =========================================
    // INITIAL RENDER
    // =========================================

    renderGuests();

    // =========================================
    // REGISTER GUEST
    // =========================================

    registerBtn?.addEventListener('click', () => {

        const name =
            guestName.value.trim();

        const documentValue =
            guestDocument.value.trim();

        const date =
            guestDate.value;

        const from =
            timeFrom.value;

        const to =
            timeTo.value;

        if (!name) {
            alert('Введите имя гостя');
            return;
        }

        if (!documentValue) {
            alert('Введите документ');
            return;
        }

        if (!date) {
            alert('Выберите дату');
            return;
        }

        if (!from || !to) {
            alert('Укажите время');
            return;
        }

        const guest = {

            id: Date.now(),

            name,

            document: documentValue,

            date,

            from,

            to,

            status: 'Активно'

        };

        guests.unshift(guest);

        localStorage.setItem(
            'guestHistory',
            JSON.stringify(guests)
        );

        renderGuests();

        clearForm();

        alert('✅ Гость зарегистрирован');

    });

    // =========================================
    // CLEAR FORM
    // =========================================

    cancelBtn?.addEventListener(
        'click',
        clearForm
    );

    function clearForm() {

        guestName.value = '';

        guestDocument.value = '';

        guestDate.value = '';

        timeFrom.value = '';

        timeTo.value = '';

    }

    // =========================================
    // RENDER HISTORY
    // =========================================

    function renderGuests() {

        if (!guestHistory) return;

        guestHistory.innerHTML = '';

        if (!guests.length) {

            guestHistory.innerHTML = `
                <div class="history-empty">
                    История гостей пока пуста
                </div>
            `;

            return;

        }

        guests.forEach((guest, index) => {

            const card =
                document.createElement('div');

            card.className =
                'history-item';

            card.style.animationDelay =
                `${index * 0.08}s`;

            card.innerHTML = `

                <div class="history-top">

                    <div class="history-name">
                        ${guest.name}
                    </div>

                    <div class="status-badge">
                        ${guest.status}
                    </div>

                </div>

                <div class="history-bottom">

                    <span>
                        📅 ${formatDate(guest.date)}
                    </span>

                    <span>
                        🕒 ${guest.from} — ${guest.to}
                    </span>

                </div>

            `;

            card.addEventListener('click', () => {

                guestName.value =
                    guest.name;

                guestDocument.value =
                    guest.document;

                guestDate.value =
                    guest.date;

                timeFrom.value =
                    guest.from;

                timeTo.value =
                    guest.to;

                window.scrollTo({

                    top: 0,

                    behavior: 'smooth'

                });

            });

            guestHistory.appendChild(card);

        });

    }

    // =========================================
    // FORMAT DATE
    // =========================================

    function formatDate(dateString) {

        if (!dateString) return '';

        return new Date(dateString)
            .toLocaleDateString('ru-RU');

    }

    console.log(
        '✅ guest_registration initialized'
    );

});