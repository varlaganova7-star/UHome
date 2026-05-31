document.addEventListener('DOMContentLoaded', () => {

    // =====================================
    // ROLE
    // =====================================

    const urlParams = new URLSearchParams(window.location.search);
    let savedRole = urlParams.get('role') || localStorage.getItem('uhome_user_role');

    if (['Electrick', 'Plumber', 'Carpenter', 'master', 'Slesar', 'Santex'].includes(savedRole)) {
        savedRole = 'master';
    }

    const userRole = savedRole || 'student';
    localStorage.setItem('uhome_user_role', userRole);

    const currentPage = window.location.pathname.split('/').pop();

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

    const fillBtn = document.querySelector('.btn-primary[href="questionnaire.html"]');
    if (fillBtn) {
        fillBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = `questionnaire.html?role=${userRole}`;
        });
    }

    const matchesBtn = document.querySelector('.btn-secondary[href="matches.html"]');
    if (matchesBtn) {
        matchesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = `matches.html?role=${userRole}`;
        });
    }

    // =====================================
    // SEARCH ON MATCHES PAGE
    // =====================================

    const searchInput = document.getElementById('matchSearch');
    const matchesList = document.getElementById('matchesList');

    if (searchInput && matchesList) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const cards = matchesList.querySelectorAll('.match-card');

            cards.forEach(card => {
                const name = (card.dataset.name || '').toLowerCase();
                card.style.display = name.includes(query) ? 'block' : 'none';
            });
        });
    }

    // =====================================
    // SELECT ROOMMATE BUTTON
    // =====================================

    const selectButtons = document.querySelectorAll('.btn-select');
    selectButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            selectButtons.forEach(button => {
                button.classList.remove('selected');
                button.textContent = 'Выбрать';
            });
            btn.classList.add('selected');
            btn.textContent = '✓ Выбран';
        });
    });

    // =====================================
    // QUESTIONNAIRE FORM - REAL API CALL
    // =====================================

    const questionnaireForm = document.getElementById('questionnaireForm');
    if (questionnaireForm) {
        questionnaireForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = questionnaireForm.querySelector('.btn-submit');
            const originalBtnText = submitBtn ? submitBtn.textContent : 'Отправить';

            if (submitBtn) {
                submitBtn.textContent = 'Отправляем...';
                submitBtn.disabled = true;
            }

            try {
                const formData = {
                    user_id: parseInt(localStorage.getItem('uhome_user_id') || '1'),
                    institute: document.getElementById('institute')?.value || '',
                    direction: document.getElementById('direction')?.value || '',
                    course: document.getElementById('course')?.value || '',
                    gender: document.querySelector('input[name="gender"]:checked')?.value || 
                            document.getElementById('gender')?.value || '',
                    bedtime: document.querySelector('input[name="bedtime"]:checked')?.value || '',
                    wakeup: document.querySelector('input[name="wakeup"]:checked')?.value || '',
                    sleep_noise: document.querySelector('input[name="sleepNoise"]:checked')?.value || '',
                    noise_attitude: parseInt(document.getElementById('noiseAttitude')?.value || '0') || null,
                    guest_attitude: parseInt(document.getElementById('guestAttitude')?.value || '0') || null,
                    call_attitude: parseInt(document.getElementById('callAttitude')?.value || '0') || null,
                    homework_time: document.querySelector('input[name="homework"]:checked')?.value || '',
                    cooking_freq: document.querySelector('input[name="cooking"]:checked')?.value || '',
                    food_type: document.querySelector('input[name="foodType"]:checked')?.value || '',
                    smell_tolerance: document.querySelector('input[name="smell"]:checked')?.value === 'yes',
                    sharing: document.querySelector('input[name="sharing"]:checked')?.value === 'yes'
                };

                const response = await fetch('http://127.0.0.1:8000/api/neighbor/questionnaire', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.detail || 'Ошибка сервера');
                }

                localStorage.setItem('uhome_user_id', formData.user_id);
                alert('✅ Анкета сохранена!');
                
                // === ИСПРАВЛЕННЫЙ ПЕРЕХОД ===
                window.location.href = 'matches.html?role=' + userRole;
                
            } catch (error) {
                console.error('❌ Ошибка отправки:', error);
                alert('⚠️ Не удалось отправить анкету. Проверьте терминал сервера.');
                if (submitBtn) {
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                }
            }
        });
    }

    // =====================================
    // STAR RATING
    // =====================================

    const starGroups = document.querySelectorAll('.stars');
    starGroups.forEach(group => {
        const stars = group.querySelectorAll('.star');
        let selectedValue = 0;

        stars.forEach((star, index) => {
            star.addEventListener('mouseenter', () => {
                stars.forEach((s, i) => s.classList.toggle('active', i <= index));
            });

            star.addEventListener('click', () => {
                selectedValue = index + 1;
                group.dataset.value = selectedValue;
                stars.forEach((s, i) => s.classList.toggle('active', i < selectedValue));
            });

            star.addEventListener('mouseleave', () => {
                stars.forEach((s, i) => s.classList.toggle('active', i < selectedValue));
            });
        });
    });

    function highlightStars(stars, count) {
        stars.forEach((star, index) => {
            star.classList.toggle('active', index < count);
        });
    }

});

// =====================================
// LOAD MATCHES FROM API (Global Function)
// =====================================

async function loadMatches() {
    const userId = localStorage.getItem('uhome_user_id');
    const matchesList = document.getElementById('matchesList');
    
    if (!matchesList || !userId) return;
    
    matchesList.innerHTML = '<div class="empty-state">Загрузка...</div>';
    
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/neighbor/matches/${userId}?min_compat=50`);
        const data = await response.json();
        
        matchesList.innerHTML = '';
        
        if (!data.matches || data.matches.length === 0) {
            matchesList.innerHTML = '<div class="empty-state">Пока нет совпадений.<br>Попробуйте изменить критерии в анкете.</div>';
            return;
        }
        
        data.matches.forEach(match => {
            const card = document.createElement('div');
            card.className = 'match-card';
            card.dataset.name = match.fullname.toLowerCase();
            card.innerHTML = `
                <div class="match-header">
                    <span class="match-name">${match.fullname}</span>
                    <span class="match-percent">${match.compatibility}%</span>
                </div>
                <div class="match-info">
                    <small>${match.questionnaire?.institute || ''} • ${match.questionnaire?.course || ''}</small>
                </div>
                <div class="match-actions">
                    <button class="btn btn-view">Посмотреть анкету</button>
                    <button class="btn btn-select">Выбрать</button>
                </div>
            `;
            matchesList.appendChild(card);
        });
        
        document.querySelectorAll('.btn-select').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.btn-select').forEach(b => {
                    b.classList.remove('selected');
                    b.textContent = 'Выбрать';
                });
                this.classList.add('selected');
                this.textContent = '✓ Выбран';
            });
        });
        
    } catch (error) {
        console.error('❌ Ошибка загрузки совпадений:', error);
        matchesList.innerHTML = '<div class="empty-state" style="color:#F26B38">Не удалось загрузить совпадения.<br>Проверьте, запущен ли сервер.</div>';
    }
}

if (window.location.pathname.includes('matches.html')) {
    document.addEventListener('DOMContentLoaded', loadMatches);
}