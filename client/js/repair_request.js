// repair_request.js

document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // ЭЛЕМЕНТЫ ФОРМЫ
    // =========================================

    const photoInput = document.getElementById('photoInput');

    const uploadedPhotos =
        document.getElementById('uploadedPhotos');

    const photoCount =
        document.getElementById('photoCount');

    const submitBtn =
        document.getElementById('submitBtn');

    const problemCategory =
        document.getElementById('problemCategory');

    const shortDescription =
        document.getElementById('shortDescription');

    const fullDescription =
        document.getElementById('fullDescription');

    // =========================================
    // ЗАГРУЗКА ФОТО
    // =========================================

    let uploadedFiles = [];

    if (photoInput) {

        photoInput.addEventListener('change', (e) => {

            const files = Array.from(e.target.files);

            const remaining = 5 - uploadedFiles.length;

            const filesToAdd = files.slice(0, remaining);

            filesToAdd.forEach(file => {

                if (!file.type.startsWith('image/')) {
                    return;
                }

                uploadedFiles.push(file);

                const reader = new FileReader();

                reader.onload = (event) => {

                    const img = document.createElement('img');

                    img.src = event.target.result;

                    img.className = 'photo-preview';

                    img.style.animationDelay =
                        `${uploadedFiles.length * 0.08}s`;

                    uploadedPhotos.appendChild(img);

                    photoCount.textContent =
                        uploadedFiles.length;
                };

                reader.readAsDataURL(file);

            });

        });

    }

    // =========================================
    // ОТПРАВКА ЗАЯВКИ
    // =========================================

    if (submitBtn) {

        submitBtn.addEventListener('click', () => {

            const category =
                problemCategory.value;

            const shortText =
                shortDescription.value.trim();

            const fullText =
                fullDescription.value.trim();

            // Проверка категории
            if (!category) {

                alert('Выберите категорию проблемы');

                return;
            }

            // Проверка описания
            if (!shortText) {

                alert('Введите краткое описание проблемы');

                return;
            }

            // Создание объекта заявки
            const repairRequest = {

                id: Date.now(),

                category: category,

                shortDescription: shortText,

                fullDescription: fullText,

                priority:
                    document.querySelector(
                        'input[name="priority"]:checked'
                    )?.value || 'low',

                createdAt:
                    new Date().toLocaleString(),

                status: 'pending',

                photos: uploadedFiles.length

            };

            console.log(
                '📦 Новая заявка:',
                repairRequest
            );

            // Пока просто alert
            alert('✅ Заявка успешно отправлена!');

            // =========================================
            // ОЧИСТКА ФОРМЫ
            // =========================================

            problemCategory.value = '';

            shortDescription.value = '';

            fullDescription.value = '';

            uploadedFiles = [];

            if (uploadedPhotos) {

                uploadedPhotos.innerHTML = '';

            }

            if (photoCount) {

                photoCount.textContent = '0';

            }

            // Сброс radio
            const defaultPriority =
                document.querySelector(
                    'input[name="priority"][value="low"]'
                );

            if (defaultPriority) {

                defaultPriority.checked = true;

            }

        });

    }

    // =========================================
    // КНОПКА ОТМЕНЫ
    // =========================================

    const cancelBtn =
        document.querySelector('.btn-cancel');

    if (cancelBtn) {

        cancelBtn.addEventListener('click', () => {

            window.location.href = 'glav.html';

        });

    }

    console.log('✅ repair_request.js загружен');

});