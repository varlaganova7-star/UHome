document.addEventListener('DOMContentLoaded', () => {

    
    // ===== ЧТЕНИЕ РОЛИ (как в скрипте выше) =====
    const urlParams = new URLSearchParams(window.location.search);
    let userRole = urlParams.get('role');
    if (!userRole) {
        userRole = localStorage.getItem('uhome_user_role') || 'student';
    }
    localStorage.setItem('uhome_user_role', userRole);
    console.log(`🔑 Роль на странице подбора: "${userRole}"`);
    
    // ===== ОБРАБОТКА КНОПОК =====
    
    // Кнопка "Заполнить анкету"
    const fillBtn = document.querySelector('.btn-primary[href="questionnaire.html"]');
    if (fillBtn) {
        fillBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Переход с сохранением роли
            window.location.href = `questionnaire.html?role=${userRole}`;
        });
    }
    
    // Кнопка "Посмотреть совпадения"
    const matchesBtn = document.querySelector('.btn-secondary[href="matches.html"]');
    if (matchesBtn) {
        matchesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Переход с сохранением роли
            window.location.href = `matches.html?role=${userRole}`;
        });
    }
    
    // ===== БОКОВОЕ МЕНЮ (открытие/закрытие) =====
    const menuBtn = document.getElementById('menuBtn');
    const sideMenu = document.getElementById('sideMenu');
    const menuClose = document.getElementById('menuClose');
    const menuOverlay = document.getElementById('sideMenuOverlay');
    
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
    
    // ===== ПОИСК ПО СОВПАДЕНИЯМ (на странице matches.html) =====
    const searchInput = document.getElementById('matchSearch');
    const matchesList = document.getElementById('matchesList');
    
    if (searchInput && matchesList) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const cards = matchesList.querySelectorAll('.match-card');
            cards.forEach(card => {
                const name = card.dataset.name || '';
                card.style.display = name.includes(query) ? 'block' : 'none';
            });
        });
    }
    
    // ===== КНОПКА "ВЫБРАТЬ" =====
    const selectBtns = document.querySelectorAll('.btn-select');
    selectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            selectBtns.forEach(b => {
                b.classList.remove('selected');
                b.textContent = 'Выбрать';
            });
            btn.classList.add('selected');
            btn.textContent = '✓ Выбран';
        });
    });
    
    // ===== ОТПРАВКА АНКЕТЫ =====
    const form = document.getElementById('questionnaireForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('.btn-submit');
            if (submitBtn) {
                submitBtn.textContent = 'Отправляем...';
                submitBtn.disabled = true;
                setTimeout(() => {
                    window.location.href = `matches.html?role=${userRole}`;
                }, 1000);
            }
        });
    }
    
    // ============================================
    // ЗВЁЗДНЫЙ РЕЙТИНГ (анкета)
    // ============================================
    const starGroups = document.querySelectorAll('.stars');

    starGroups.forEach(group => {
        const stars = group.querySelectorAll('.star');
        const ratingName = group.dataset.rating;
        let selectedValue = 0;

        stars.forEach((star, index) => {
            // Hover
            star.addEventListener('mouseenter', () => {
                highlightStars(stars, index + 1);
            });

            // Click
            star.addEventListener('click', () => {
                selectedValue = index + 1;
                group.dataset.value = selectedValue;
                highlightStars(stars, selectedValue);
            });

            // Leave
            star.addEventListener('mouseleave', () => {
                highlightStars(stars, selectedValue);
            });
        });
    });

    function highlightStars(stars, count) {
        stars.forEach((star, index) => {
            star.classList.toggle('active', index < count);
        });
    }  
        // Клик по профилю → переход на profile.html
    const userProfileBlock = document.querySelector('.user-profile');
    if (userProfileBlock) {
        userProfileBlock.style.cursor = 'pointer';
        userProfileBlock.addEventListener('click', () => {
            closeMenu();
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 300);
        });
    }
});