document.addEventListener('DOMContentLoaded', () => {

// =====================================
// ELEMENTS
// =====================================

const container =
    document.getElementById('authContainer');

const registerForm =
    document.getElementById('registerForm');

const loginForm =
    document.getElementById('loginForm');

const toggleBtn =
    document.getElementById('toggleBtn');

const roleSelect =
    document.getElementById('role');

// =====================================
// INITIAL STATE
// =====================================

let isLogin = false;

// =====================================
// SWITCH LOGIN
// =====================================

function showLogin() {

    isLogin = true;

    container.classList.add('login');

    container.classList.remove('register');

    registerForm.classList.remove('active');

    loginForm.classList.add('active');

    toggleBtn.textContent =
        'Зарегистрироваться';
}

// =====================================
// SWITCH REGISTER
// =====================================

function showRegister() {

    isLogin = false;

    container.classList.add('register');

    container.classList.remove('login');

    loginForm.classList.remove('active');

    registerForm.classList.add('active');

    toggleBtn.textContent =
        'Авторизоваться';
}

// =====================================
// TOGGLE BUTTON
// =====================================

toggleBtn.addEventListener('click', () => {

    if (isLogin) {

        showRegister();

    } else {

        showLogin();
    }
});

// =====================================
// REGISTER
// =====================================

registerForm.addEventListener('submit', async (e) => {

    e.preventDefault();

    const inputs =
        registerForm.querySelectorAll('.form-input');

    const fullname =
        inputs[0].value.trim();

    const email =
        inputs[1].value.trim();

    const password =
        inputs[2].value.trim();

    const role =
        roleSelect.value;

    // ===== ПРОВЕРКА ПУСТЫХ ПОЛЕЙ =====

    if (!role ||
        !fullname ||
        !email ||
        !password) {

        alert(
            'Заполните все поля'
        );

        return;
    }

    // ===== ПРОВЕРКА EMAIL =====

    if (!email.includes('@')) {

        alert(
            'Введите корректную почту'
        );

        return;
    }

    // ===== ПРОВЕРКА ПАРОЛЯ =====

    if (password.length < 6) {

        alert(
            'Пароль минимум 6 символов'
        );

        return;
    }

    const data = {

        role,
        fullname,
        email,
        password
    };

    try {

        const response = await fetch(
            'http://127.0.0.1:8000/register',
            {
                method: 'POST',

                headers: {
                    'Content-Type':
                        'application/json'
                },

                body: JSON.stringify(data)
            }
        );

        const result =
            await response.json();

        // ===== ОШИБКА =====

        if (result.error) {

            alert(result.error);

            return;
        }

        // ===== SUCCESS =====

        localStorage.setItem(
            'uhome_logged_in',
            'true'
        );

        localStorage.setItem(
            'uhome_user_role',
            role
        );

        localStorage.setItem(
            'uhome_user_fullname',
            fullname
        );

        alert(
            'Регистрация успешна'
        );

        window.location.href =
            'glav.html';

    } catch (error) {

        alert(
            'Ошибка подключения к серверу'
        );
    }
});

// =====================================
// LOGIN
// =====================================

loginForm.addEventListener('submit', async (e) => {

    e.preventDefault();

    const inputs =
        loginForm.querySelectorAll('.form-input');

    const email =
        inputs[0].value.trim();

    const password =
        inputs[1].value.trim();

    // ===== ПРОВЕРКА =====

    if (!email || !password) {

        alert(
            'Введите почту и пароль'
        );

        return;
    }

    try {

        const response = await fetch(
            'http://127.0.0.1:8000/login',
            {
                method: 'POST',

                headers: {
                    'Content-Type':
                        'application/json'
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const result =
            await response.json();

        // ===== НЕВЕРНЫЕ ДАННЫЕ =====

        if (
            result.error ||
            !response.ok
        ) {

            alert(
                'Неверная почта или пароль'
            );

            return;
        }

        // ===== SUCCESS =====

        localStorage.setItem(
            'uhome_logged_in',
            'true'
        );

        localStorage.setItem(
            'uhome_user_role',
            result.role
        );

        localStorage.setItem(
            'uhome_user_fullname',
            result.fullname
        );

        alert(
            'Вход выполнен'
        );

        window.location.href =
            'glav.html';

    } catch (error) {

        alert(
            'Ошибка подключения к серверу'
        );
    }
});

// =====================================
// START
// =====================================

showRegister();

});
