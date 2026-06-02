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

    const formsArea =
        document.querySelector('.forms-area');



    // =====================================
    // STATE
    // =====================================

    let isLogin = false;



    // =====================================
    // MOBILE HEIGHT
    // =====================================

    function updateMobileHeight() {

        if (window.innerWidth > 768) {

            formsArea.style.height = '';
            return;
        }

        const activeForm =
            isLogin
                ? loginForm
                : registerForm;

        formsArea.style.height =
            activeForm.offsetHeight + 'px';
    }



    // =====================================
    // SWITCH MODE
    // =====================================

    function switchMode(loginMode) {

        isLogin = loginMode;

        toggleBtn.style.opacity = '0';

        setTimeout(() => {

            if (loginMode) {

                container.classList.add('login');
                container.classList.remove('register');

                toggleBtn.textContent =
                    'Зарегистрироваться';

            } else {

                container.classList.add('register');
                container.classList.remove('login');

                toggleBtn.textContent =
                    'Авторизоваться';
            }

            toggleBtn.style.opacity = '1';

            requestAnimationFrame(() => {
                updateMobileHeight();
            });

        }, 150);
    }



    // =====================================
    // TOGGLE
    // =====================================

    toggleBtn.addEventListener('click', () => {

        switchMode(!isLogin);

    });



    // =====================================
    // RESIZE
    // =====================================

    window.addEventListener(
        'resize',
        updateMobileHeight
    );



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

        if (!email || !password) {

            alert(
                'Введите почту и пароль'
            );

            return;
        }

        localStorage.setItem(
            'uhome_logged_in',
            'true'
        );

        localStorage.setItem(
            'uhome_user_email',
            email
        );

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

        window.location.href =
            'glav.html';

    });



    // =====================================
    // START
    // =====================================

    switchMode(false);

    setTimeout(() => {
        updateMobileHeight();
    }, 50);

});