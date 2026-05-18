
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

    registerForm.addEventListener('submit', async (e) => {

        e.preventDefault();

        const inputs =
            registerForm.querySelectorAll('.form-input');

        const data = {

            role: roleSelect.value,

            fullname: inputs[0].value,

            email: inputs[1].value,

            password: inputs[2].value
        };

        const response = await fetch(
            'http://127.0.0.1:8000/register',
            {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(data)
            }
        );

        const result = await response.json();

        if (response.ok && !result.error) {

            alert('Успешная регистрация');

            window.location.href = 'glav.html';

        } else {

            alert(result.error);
        }
    });



    // =====================================
    // LOGIN SUBMIT
    // =====================================

    loginForm.addEventListener('submit', async (e) => {

        e.preventDefault();

        const inputs =
            loginForm.querySelectorAll('.form-input');

        const data = {

            email: inputs[0].value,

            password: inputs[1].value
        };

        const response = await fetch(
            'http://127.0.0.1:8000/login',
            {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(data)
            }
        );

        const result = await response.json();

        if (response.ok && !result.error) {

            localStorage.setItem(
                'uhome_user_role',
                result.role
            );

            window.location.href = 'glav.html';

        } else {

            alert(result.error);
        }
    });



    // =====================================
    // START MODE
    // =====================================

    showRegister();

});
