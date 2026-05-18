
document.addEventListener('DOMContentLoaded', () => {

    // =====================================
    // ELEMENTS
    // =====================================

    const container = document.getElementById('authContainer');

    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    const toggleBtn = document.getElementById('toggleBtn');

    const roleSelect = document.getElementById('role');



    // =====================================
    // INITIAL STATE
    // =====================================

    let isLogin = false;



    // =====================================
    // SWITCH TO LOGIN
    // =====================================

    function showLogin() {

        isLogin = true;

        container.classList.add('login');
        container.classList.remove('register');

        registerForm.classList.remove('active');
        loginForm.classList.add('active');

        toggleBtn.textContent = 'Зарегистрироваться';
    }



    // =====================================
    // SWITCH TO REGISTER
    // =====================================

    function showRegister() {

        isLogin = false;

        container.classList.add('register');
        container.classList.remove('login');

        loginForm.classList.remove('active');
        registerForm.classList.add('active');

        toggleBtn.textContent = 'Авторизоваться';
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
    // REGISTER SUBMIT
    // =====================================

    registerForm.addEventListener('submit', (e) => {

        e.preventDefault();

        const selectedRole = roleSelect.value;

        localStorage.setItem(
            'uhome_user_role',
            selectedRole
        );

        const submitBtn =
            registerForm.querySelector('.form-btn');

        submitBtn.textContent = 'Готово!';
        submitBtn.disabled = true;

        setTimeout(() => {

            window.location.href = 'glav.html';

        }, 700);
    });



    // =====================================
    // LOGIN SUBMIT
    // =====================================

    loginForm.addEventListener('submit', (e) => {

        e.preventDefault();

        localStorage.setItem(
            'uhome_user_role',
            'student'
        );

        const submitBtn =
            loginForm.querySelector('.form-btn');

        submitBtn.textContent = 'Вход...';
        submitBtn.disabled = true;

        setTimeout(() => {

            window.location.href = 'glav.html';

        }, 500);
    });



    // =====================================
    // START MODE
    // =====================================

    showRegister();

});
