document.addEventListener('DOMContentLoaded', () => {

    const fullName =
        document.getElementById('fullName');

    const email =
        document.getElementById('email');

    const phone =
        document.getElementById('phone');

    const room =
        document.getElementById('room');

    const faculty =
        document.getElementById('faculty');

    const group =
        document.getElementById('group');

    const about =
        document.getElementById('about');

    const avatar =
        document.getElementById('profileAvatar');

    const avatarInput =
        document.getElementById('avatarInput');

    const form =
        document.getElementById('profileForm');

    // -------------------
    // Автозаполнение
    // -------------------

    fullName.value =
        localStorage.getItem(
            'uhome_user_fullname'
        ) || '';

    email.value =
        localStorage.getItem(
            'uhome_user_email'
        ) || '';

    // -------------------
    // Дополнительные поля
    // -------------------

    phone.value =
        localStorage.getItem(
            'uhome_user_phone'
        ) || '';

    room.value =
        localStorage.getItem(
            'uhome_user_room'
        ) || '';

    faculty.value =
        localStorage.getItem(
            'uhome_user_faculty'
        ) || '';

    group.value =
        localStorage.getItem(
            'uhome_user_group'
        ) || '';

    about.value =
        localStorage.getItem(
            'uhome_user_about'
        ) || '';

    // -------------------
    // Фото
    // -------------------

    const savedAvatar =
        localStorage.getItem(
            'uhome_user_avatar'
        );

    if (savedAvatar) {

        avatar.src = savedAvatar;

    } else {

        const firstLetter =
            (fullName.value || 'П')
            .charAt(0);

        avatar.src =
            `https://ui-avatars.com/api/?name=${firstLetter}&background=F47920&color=fff&size=256`;
    }

    avatarInput.addEventListener(
        'change',
        e => {

            const file =
                e.target.files[0];

            if (!file) return;

            const reader =
                new FileReader();

            reader.onload =
                function(event) {

                    avatar.src =
                        event.target.result;

                    localStorage.setItem(
                        'uhome_user_avatar',
                        event.target.result
                    );
                };

            reader.readAsDataURL(file);
        }
    );

    // -------------------
    // Сохранение
    // -------------------

    form.addEventListener(
        'submit',
        e => {

            e.preventDefault();

            localStorage.setItem(
                'uhome_user_phone',
                phone.value
            );

            localStorage.setItem(
                'uhome_user_room',
                room.value
            );

            localStorage.setItem(
                'uhome_user_faculty',
                faculty.value
            );

            localStorage.setItem(
                'uhome_user_group',
                group.value
            );

            localStorage.setItem(
                'uhome_user_about',
                about.value
            );

            alert(
                'Профиль успешно сохранён'
            );
        }
    );
});