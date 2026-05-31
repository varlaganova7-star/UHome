document.addEventListener('DOMContentLoaded', () => {

    // =====================================
    // ROLE
    // =====================================

    const urlParams =
        new URLSearchParams(window.location.search);

    let savedRole =
        urlParams.get('role') ||
        localStorage.getItem('uhome_user_role');

    if (
        [
            'Electrick',
            'Plumber',
            'Carpenter',
            'master',
            'Slesar',
            'Santex'
        ].includes(savedRole)
    ) {
        savedRole = 'master';
    }

    const userRole =
        savedRole || 'student';

    localStorage.setItem(
        'uhome_user_role',
        userRole
    );

    const currentPage =
        window.location.pathname
            .split('/')
            .pop();

    // =====================================
    // ONLY FOR NEIGHBOR PAGES
    // =====================================

    const isNeighborPage =
        currentPage === 'neighbor.html' ||
        currentPage === 'questionnaire.html' ||
        currentPage === 'matches.html';

    if (!isNeighborPage) return;

    console.log('✅ Загружена логика подбора соседа');

    // =====================================
    // BUTTONS
    // =====================================

    const fillBtn =
        document.querySelector(
            '.btn-primary[href="questionnaire.html"]'
        );

    if (fillBtn) {

        fillBtn.addEventListener(
            'click',
            (e) => {

                e.preventDefault();

                window.location.href =
                    `questionnaire.html?role=${userRole}`;
            }
        );
    }

    const matchesBtn =
        document.querySelector(
            '.btn-secondary[href="matches.html"]'
        );

    if (matchesBtn) {

        matchesBtn.addEventListener(
            'click',
            (e) => {

                e.preventDefault();

                window.location.href =
                    `matches.html?role=${userRole}`;
            }
        );
    }

    // =====================================
    // SEARCH ON MATCHES PAGE
    // =====================================

    const searchInput =
        document.getElementById('matchSearch');

    const matchesList =
        document.getElementById('matchesList');

    if (searchInput && matchesList) {

        searchInput.addEventListener(
            'input',
            (e) => {

                const query =
                    e.target.value
                        .toLowerCase()
                        .trim();

                const cards =
                    matchesList.querySelectorAll(
                        '.match-card'
                    );

                cards.forEach(card => {

                    const name =
                        (card.dataset.name || '')
                            .toLowerCase();

                    card.style.display =
                        name.includes(query)
                            ? 'block'
                            : 'none';
                });
            }
        );
    }

    // =====================================
    // SELECT ROOMMATE BUTTON
    // =====================================

    const selectButtons =
        document.querySelectorAll(
            '.btn-select'
        );

    selectButtons.forEach(btn => {

        btn.addEventListener(
            'click',
            () => {

                selectButtons.forEach(button => {

                    button.classList.remove(
                        'selected'
                    );

                    button.textContent =
                        'Выбрать';
                });

                btn.classList.add(
                    'selected'
                );

                btn.textContent =
                    '✓ Выбран';
            }
        );
    });

    // =====================================
    // QUESTIONNAIRE FORM
    // =====================================

    const questionnaireForm =
        document.getElementById(
            'questionnaireForm'
        );

    if (questionnaireForm) {

        questionnaireForm.addEventListener(
            'submit',
            (e) => {

                e.preventDefault();

                const submitBtn =
                    questionnaireForm.querySelector(
                        '.btn-submit'
                    );

                if (submitBtn) {

                    submitBtn.textContent =
                        'Отправляем...';

                    submitBtn.disabled =
                        true;
                }

                setTimeout(() => {

                    window.location.href =
                        `matches.html?role=${userRole}`;

                }, 1000);
            }
        );
    }

    // =====================================
    // STAR RATING
    // =====================================

    const starGroups =
        document.querySelectorAll(
            '.stars'
        );

    starGroups.forEach(group => {

        const stars =
            group.querySelectorAll(
                '.star'
            );

        let selectedValue = 0;

        stars.forEach(
            (star, index) => {

                star.addEventListener(
                    'mouseenter',
                    () => {

                        highlightStars(
                            stars,
                            index + 1
                        );
                    }
                );

                star.addEventListener(
                    'click',
                    () => {

                        selectedValue =
                            index + 1;

                        group.dataset.value =
                            selectedValue;

                        highlightStars(
                            stars,
                            selectedValue
                        );
                    }
                );

                star.addEventListener(
                    'mouseleave',
                    () => {

                        highlightStars(
                            stars,
                            selectedValue
                        );
                    }
                );
            }
        );
    });

    function highlightStars(
        stars,
        count
    ) {

        stars.forEach(
            (star, index) => {

                star.classList.toggle(
                    'active',
                    index < count
                );
            }
        );
    }

});