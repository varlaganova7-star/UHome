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

    registerForm.addEventListener('submit', (e) => {

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



        // =====================================
        // VALIDATION
        // =====================================

        if (
            !role ||
            !fullname ||
            !email ||
            !password
        ) {

            alert(
                'Заполните все поля'
            );

            return;
        }

        if (!email.includes('@')) {

            alert(
                'Введите корректную почту'
            );

            return;
        }

        if (password.length < 6) {

            alert(
                'Пароль минимум 6 символов'
            );

            return;
        }



        // =====================================
        // LOCAL AUTH ONLY
        // =====================================

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

        localStorage.setItem(
            'uhome_user_email',
            email
        );



        alert(
            'Регистрация успешна'
        );



        window.location.href =
            'glav.html';
    });



    // =====================================
    // LOGIN
    // =====================================

    loginForm.addEventListener('submit', (e) => {

        e.preventDefault();

        const inputs =
            loginForm.querySelectorAll('.form-input');

        const email =
            inputs[0].value.trim();

        const password =
            inputs[1].value.trim();



        // =====================================
        // VALIDATION
        // =====================================

        if (!email || !password) {

            alert(
                'Введите почту и пароль'
            );

            return;
        }



        // =====================================
        // LOCAL AUTH ONLY
        // =====================================

        localStorage.setItem(
            'uhome_logged_in',
            'true'
        );

        localStorage.setItem(
            'uhome_user_email',
            email
        );



        // если данных нет — ставим дефолт

        if (!localStorage.getItem('uhome_user_role')) {

            localStorage.setItem(
                'uhome_user_role',
                'student'
            );
        }

        if (!localStorage.getItem('uhome_user_fullname')) {

            localStorage.setItem(
                'uhome_user_fullname',
                'Пользователь'
            );
        }



        alert(
            'Вход выполнен'
        );



        window.location.href =
            'glav.html';
    });



    // =====================================
    // OLD BACKEND CODE
    // =====================================

    /*
    
    СТАРЫЙ КОД С FETCH И BACKEND ОСТАВЛЕН ТУТ
    ЧТОБЫ МОЖНО БЫЛО ВЕРНУТЬ ПОТОМ

    fetch(
        'http://127.0.0.1:8000/register'
    )

    fetch(
        'http://127.0.0.1:8000/login'
    )

    try / catch
    response.json()
    await fetch()

    */



    // =====================================
    // START
    // =====================================

    showRegister();

});