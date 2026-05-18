// ===== ЭЛЕМЕНТЫ =====
const submitBtn = document.querySelector(".submit");
const cancelBtn = document.querySelector(".cancel");

const fileInput = document.getElementById("photos");
const uploadBox = document.getElementById("uploadBox");
const preview = document.getElementById("preview");

const addTimeBtn = document.querySelector(".add-time");
const container = document.getElementById("datetime-container");

// ===== СОСТОЯНИЕ ФОТО =====
let selectedFiles = [];

// ===== СРОЧНОСТЬ =====
document.querySelectorAll(".priority").forEach(item => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".priority").forEach(el =>
      el.classList.remove("active")
    );
    item.classList.add("active");
  });
});

// ===== ЗАГРУЗКА ФОТО =====
uploadBox.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => {
  const newFiles = Array.from(fileInput.files);

  // добавляем и ограничиваем до 5
  selectedFiles = [...selectedFiles, ...newFiles].slice(0, 5);

  renderPreview();
});

// ===== ПРЕДПРОСМОТР + УДАЛЕНИЕ =====
function renderPreview() {
  preview.innerHTML = "";

  uploadBox.innerText = `Загружено: ${selectedFiles.length}/5`;

  selectedFiles.forEach((file, index) => {
    const reader = new FileReader();

    reader.onload = e => {
      const wrapper = document.createElement("div");
      wrapper.style.position = "relative";

      const img = document.createElement("img");
      img.src = e.target.result;

      const removeBtn = document.createElement("div");
      removeBtn.innerText = "✕";

      removeBtn.style.position = "absolute";
      removeBtn.style.top = "2px";
      removeBtn.style.right = "2px";
      removeBtn.style.background = "#000";
      removeBtn.style.color = "#fff";
      removeBtn.style.borderRadius = "50%";
      removeBtn.style.width = "18px";
      removeBtn.style.height = "18px";
      removeBtn.style.fontSize = "12px";
      removeBtn.style.display = "flex";
      removeBtn.style.alignItems = "center";
      removeBtn.style.justifyContent = "center";
      removeBtn.style.cursor = "pointer";

      removeBtn.onclick = () => {
        selectedFiles.splice(index, 1);
        renderPreview();
      };

      wrapper.appendChild(img);
      wrapper.appendChild(removeBtn);
      preview.appendChild(wrapper);
    };

    reader.readAsDataURL(file);
  });
}

// ===== ДОБАВЛЕНИЕ ДАТЫ =====
addTimeBtn.addEventListener("click", () => {
  const block = document.createElement("div");
  block.classList.add("datetime");

  block.innerHTML = `
    <input type="date" class="date"/>

    <div class="time-group">
      <span>С</span>
      <input type="time" class="time-from"/>
    </div>

    <div class="time-group">
      <span>До</span>
      <input type="time" class="time-to"/>
    </div>
  `;

  container.appendChild(block);
});

// ===== ПОЛУЧЕНИЕ ДАННЫХ =====
function getFormData() {
  const category = document.querySelector(".select-real").value;
  const shortDesc = document.querySelector(".short-desc").value;
  const fullDesc = document.querySelector("textarea").value;

  const dates = [];

  document.querySelectorAll(".datetime").forEach(block => {
    const date = block.querySelector(".date").value;
    const from = block.querySelector(".time-from").value;
    const to = block.querySelector(".time-to").value;

    if (date && from && to) {
      dates.push({ date, from, to });
    }
  });

  const activePriority = document.querySelector(".priority.active");

  const priority = activePriority
    ? activePriority.innerText.trim()
    : "";

  return {
    category,
    short_desc: shortDesc,
    full_desc: fullDesc,
    priority,
    dates
  };
}

// ===== ВАЛИДАЦИЯ =====
function validate(data) {
  if (!data.category || data.category.includes("Выберите")) {
    alert("Выберите категорию");
    return false;
  }

  if (!data.short_desc) {
    alert("Введите краткое описание");
    return false;
  }

  if (!data.priority) {
    alert("Выберите срочность");
    return false;
  }

  if (data.dates.length === 0) {
    alert("Выберите дату и время");
    return false;
  }

  return true;
}

// ===== ОТПРАВКА =====
submitBtn.addEventListener("click", () => {
  const data = getFormData();

  if (!validate(data)) return;

  const formData = new FormData();

  formData.append("category", data.category);
  formData.append("short_desc", data.short_desc);
  formData.append("full_desc", data.full_desc);
  formData.append("priority", data.priority);

  formData.append("dates", JSON.stringify(data.dates));

  // 🔥 правильная отправка фото
  selectedFiles.forEach(file => {
    formData.append("photos", file);
  });

  fetch("http://127.0.0.1:5000/submit", {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(() => {
      alert("Заявка отправлена!");
      clearForm();
    })
    .catch(err => {
      console.error(err);
      alert("Ошибка соединения с сервером");
    });
});

// ===== ОЧИСТКА =====
function clearForm() {
  document.querySelector(".short-desc").value = "";
  document.querySelector("textarea").value = "";

  document.querySelectorAll(".date").forEach(i => i.value = "");
  document.querySelectorAll(".time-from").forEach(i => i.value = "");
  document.querySelectorAll(".time-to").forEach(i => i.value = "");

  selectedFiles = [];
  preview.innerHTML = "";
  uploadBox.innerText = "Нажмите для загрузки фото (0/5)";

  document.querySelectorAll(".priority").forEach(p =>
    p.classList.remove("active")
  );
}

// ===== ОТМЕНА =====
cancelBtn.addEventListener("click", clearForm);