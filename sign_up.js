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
// ===== ОБРАБОТКА ФОРМЫ ВХОДА =====
loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Останавливаем перезагрузку страницы

    const btn = loginForm.querySelector('.form-btn');
    const originalText = btn.textContent;

    // Имитация процесса входа
    btn.textContent = 'Входим...';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    // Задержка 0.8 сек для реалистичности, затем переход
    setTimeout(() => {
        // 👇 УКАЖИ ТОЧНОЕ ИМЯ ФАЙЛА ГЛАВНОЙ СТРАНИЦЫ
        window.location.href = 'glav.html'; 
    }, 800);
});


