const container = document.getElementById('authContainer');
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const toggleBtn = document.getElementById('toggleBtn');
const toLogin = document.getElementById('toLogin');
const toRegister = document.getElementById('toRegister');

function showLogin() {
    // Сначала скрываем регистрацию
    registerForm.classList.remove('active');

    // Через небольшую задержку показываем вход
    setTimeout(() => {
        container.classList.replace('register', 'login');
        loginForm.classList.add('active');
        toggleBtn.textContent = 'Зарегистрироваться';
    }, 200);
}

function showRegister() {
    // Сначала скрываем вход
    loginForm.classList.remove('active');

    // Через небольшую задержку показываем регистрацию
    setTimeout(() => {
        container.classList.replace('login', 'register');
        registerForm.classList.add('active');
        toggleBtn.textContent = 'Авторизоваться';
    }, 200);
}

toggleBtn.addEventListener('click', () => {
    if (container.classList.contains('register')) {
        showLogin();
    } else {
        showRegister();
    }
});

toLogin.addEventListener('click', showLogin);
toRegister.addEventListener('click', showRegister);

// Предотвращаем отправку
document.querySelectorAll('.auth-form').forEach(form => {
    form.addEventListener('submit', e => e.preventDefault());
});