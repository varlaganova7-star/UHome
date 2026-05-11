const container = document.getElementById("requests-container");

const tabs = document.querySelectorAll(".tab");

const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const closeModal = document.getElementById("closeModal");

let currentFilter = "all";

/* =========================
   ЗАГРУЗКА ЗАЯВОК
========================= */

loadRequests();

/* АВТООБНОВЛЕНИЕ */
setInterval(loadRequests, 5000);

/* =========================
   FILTERS
========================= */

tabs.forEach(tab => {

  tab.addEventListener("click", () => {

    tabs.forEach(t => t.classList.remove("active"));

    tab.classList.add("active");

    currentFilter = tab.dataset.filter;

    loadRequests();

  });

});

/* =========================
   LOAD REQUESTS
========================= */

function loadRequests(){

  fetch("http://127.0.0.1:5000/requests")
    .then(res => res.json())
    .then(data => {

      container.innerHTML = "";

      let filtered = data;

      if(currentFilter === "Ожидают"){

        filtered = data.filter(item =>

            item.status === "Ожидают" ||
            item.status === "Скоро приду"

      );

      }else if(currentFilter !== "all"){

        filtered = data.filter(item =>
        item.status === currentFilter
      );

      }

      filtered.forEach(request => {

        createCard(request);

      });

    });

}

/* =========================
   CREATE CARD
========================= */

function createCard(request){

  const card = document.createElement("div");

  card.className = "request-card";

  const photos = createPhotos(request.photos);

  card.innerHTML = `

    <div class="request-top">

      <div>

        <div class="request-title">
          ${request.short_desc}
        </div>

        <div class="info">
          🔧 ${request.category}
        </div>

        <div class="info">
          📅 ${formatDates(request.dates)}
        </div>

      </div>

      <div class="status ${getStatusClass(request.status)}">
        ${request.status}
      </div>

    </div>

    <div class="priority ${getPriorityClass(request.priority)}">
      ${request.priority}
    </div>

    <div class="toggle">
      ▼ Показать детали
    </div>

    <div class="details">

      <div class="detail-title">
        Полное описание
      </div>

      <div class="detail-text">
        ${request.full_desc || "Описание отсутствует"}
      </div>

      <div class="detail-title">
        Фотографии проблемы
      </div>

      <div class="photos">
        ${photos}
      </div>

    </div>

    <div class="actions">

      <button class="action-btn gray soon-btn">
        👷 Скоро приду
      </button>

      <button class="action-btn gray move-btn">
        📅 Нужно перенести
      </button>

      <button class="action-btn gray details-btn">
        🔧 Нет деталей
      </button>

      <button class="action-btn green done-btn">
        ✅ Работа выполнена
      </button>

    </div>

  `;

  /* =========================
     АКТИВНЫЕ КНОПКИ
  ========================= */

  const soonBtn = card.querySelector(".soon-btn");
  const doneBtn = card.querySelector(".done-btn");

  if(request.status === "Скоро приду"){

    soonBtn.classList.add("active");

  }

  if(request.status === "Выполнено"){

    doneBtn.classList.add("active");

  }

  /* =========================
     TOGGLE DETAILS
  ========================= */

  const toggle = card.querySelector(".toggle");
  const details = card.querySelector(".details");

  toggle.addEventListener("click", () => {

    if(details.style.display === "block"){

      details.style.display = "none";

      toggle.innerHTML = "▼ Показать детали";

    }else{

      details.style.display = "block";

      toggle.innerHTML = "▲ Скрыть детали";

    }

  });

  /* =========================
     BUTTONS
  ========================= */

  const moveBtn = card.querySelector(".move-btn");

  const detailsBtn = card.querySelector(".details-btn");

  /* СКОРО ПРИДУ */

  soonBtn.addEventListener("click", () => {

    updateStatus(request.id, "Скоро приду");

  });

  /* РАБОТА ВЫПОЛНЕНА */

  doneBtn.addEventListener("click", () => {

    updateStatus(request.id, "Выполнено");

  });

  /* НУЖНО ПЕРЕНЕСТИ */

  moveBtn.addEventListener("click", () => {

    const confirmDelete = confirm(
      "Удалить заявку?"
    );

    if(!confirmDelete) return;

    deleteRequest(request.id);

  });

  /* НЕТ ДЕТАЛЕЙ */

  detailsBtn.addEventListener("click", () => {

    const confirmDelete = confirm(
      "Удалить заявку?"
    );

    if(!confirmDelete) return;

    deleteRequest(request.id);

  });

  container.appendChild(card);

  /* =========================
     FULLSCREEN PHOTO
  ========================= */

  card.querySelectorAll(".photos img").forEach(img => {

    img.addEventListener("click", () => {

      modal.style.display = "flex";

      modalImage.src = img.src;

    });

  });

}

/* =========================
   CREATE PHOTOS
========================= */

function createPhotos(photos){

  if(!photos || photos.length === 0){

    return `
      <div class="detail-text">
        Фото отсутствуют
      </div>
    `;

  }

  return photos.map(photo => `

    <img src="http://127.0.0.1:5000/uploads/${photo}">

  `).join("");

}

/* =========================
   UPDATE STATUS
========================= */

function updateStatus(id, status){

  fetch(`http://127.0.0.1:5000/update_status/${id}`, {

    method:"POST",

    headers:{
      "Content-Type":"application/json"
    },

    body:JSON.stringify({
      status
    })

  })
  .then(res => res.json())
  .then(() => {

    loadRequests();

  });

}

/* =========================
   DELETE REQUEST
========================= */

function deleteRequest(id){

  fetch(`http://127.0.0.1:5000/delete_request/${id}`, {

    method:"DELETE"

  })
  .then(res => res.json())
  .then(() => {

    loadRequests();

  });

}

/* =========================
   FORMAT DATES
========================= */

function formatDates(dates){

  if(typeof dates === "string"){

    dates = JSON.parse(dates);

  }

  return dates.map(d =>

    `${d.date} ${d.from} - ${d.to}`

  ).join(", ");

}

/* =========================
   PRIORITY COLORS
========================= */

function getPriorityClass(priority){

  if(priority.includes("Низкая")) return "low";

  if(priority.includes("Средняя")) return "medium";

  return "high";

}

/* =========================
   STATUS COLORS
========================= */

function getStatusClass(status){

  if(status === "Скоро приду"){
    return "status-soon";
  }

  if(status === "Выполнено"){
    return "status-done";
  }

  return "";

}

/* =========================
   MODAL
========================= */

closeModal.addEventListener("click", () => {

  modal.style.display = "none";

});

modal.addEventListener("click", e => {

  if(e.target === modal){

    modal.style.display = "none";

  }

});