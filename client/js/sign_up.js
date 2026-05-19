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
    // STATE
    // =====================================

    let isLogin = false;



    // =====================================
    // SHOW LOGIN
    // =====================================

    function showLogin() {

        isLogin = true;

        container.classList.add('login');

        container.classList.remove('register');

        toggleBtn.textContent =
            'Зарегистрироваться';
    }



    // =====================================
    // SHOW REGISTER
    // =====================================

    function showRegister() {

        isLogin = false;

        container.classList.add('register');

        container.classList.remove('login');

        toggleBtn.textContent =
            'Авторизоваться';
    }



    // =====================================
    // TOGGLE
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



        // VALIDATION

        if (
            !role ||
            !fullname ||
            !email ||
            !password
        ) {

            alert('Заполните все поля');
            return;
        }

        if (!email.includes('@')) {

            alert('Введите корректную почту');
            return;
        }

        if (password.length < 6) {

            alert('Пароль минимум 6 символов');
            return;
        }



        // SAVE USER

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



        // REDIRECT

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



        // VALIDATION

        if (!email || !password) {

            alert(
                'Введите почту и пароль'
            );

            return;
        }



        // LOGIN

        localStorage.setItem(
            'uhome_logged_in',
            'true'
        );

        localStorage.setItem(
            'uhome_user_email',
            email
        );



        // DEFAULT USER

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



        // REDIRECT

        window.location.href =
            'glav.html';
    });



    // =====================================
    // START
    // =====================================

    showRegister();

});