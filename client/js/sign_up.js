document.addEventListener('DOMContentLoaded', () => {
    
    const container = document.getElementById('authContainer');
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const toggleBtn = document.getElementById('toggleBtn');
    const roleSelect = document.getElementById('role');

    // ===== ПЕРЕКЛЮЧЕНИЕ ФОРМ =====
    function showLogin() {
        registerForm?.classList.remove('active');
        setTimeout(() => {
            container?.classList.replace('register', 'login');
            loginForm?.classList.add('active');
            if(toggleBtn) toggleBtn.textContent = 'Зарегистрироваться';
        }, 200);
    }

    function showRegister() {
        loginForm?.classList.remove('active');
        setTimeout(() => {
            container?.classList.replace('login', 'register');
            registerForm?.classList.add('active');
            if(toggleBtn) toggleBtn.textContent = 'Авторизоваться';
        }, 200);
    }

    if(toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            container?.classList.contains('register') ? showLogin() : showRegister();
        });
    }

    // ===== РЕГИСТРАЦИЯ: СОХРАНЯЕМ РОЛЬ И ПЕРЕХОДИМ =====
    if(registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const selectedRole = roleSelect?.value || 'student';
            
            console.log('✅ Регистрация:', selectedRole);
            
            // 🔥 СОХРАНЯЕМ РОЛЬ В ПАМЯТИ БРАУЗЕРА
            localStorage.setItem('uhome_user_role', selectedRole);
            
            const btn = registerForm.querySelector('.form-btn');
            if(btn) {
                btn.textContent = 'Готово!';
                btn.disabled = true;
            }

            // Переход на главную
            setTimeout(() => {
                window.location.href = 'glav.html';
            }, 600);
        });
    }

    // ===== ВХОД: ПЕРЕХОД НА ГЛАВНУЮ =====
    if(loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Для входа можно тоже сохранять роль, если нужно
            localStorage.setItem('uhome_user_role', 'student');
            window.location.href = 'glav.html';
        });
    }
});