const timeslots = [
  "16:00 - 18:00",
  "18:30 - 20:30"
];

function isSlotInFuture(slot) {
  const [start] = slot.split(" - ");
  const [h, m] = start.split(":").map(Number);

  const now = new Date();
  const slotTime = new Date();
  slotTime.setHours(h, m, 0, 0);

  return slotTime > now;
}


// ======================
// TELEGRAM
// ======================
function sendTelegramMessage(text) {
  const token = "8019884991:AAFCLg_I-KvoB6PREqh596eruLgivij59K8";
  const chatId = "6738014483";

  fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text
    })
  });
}

// ======================
// DATA
// ======================
let pendingReservation = null;

function getReservations() {
  return JSON.parse(localStorage.getItem("reservations") || "[]");
}

function cleanOldReservations() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const validReservations = getReservations().filter(r => {
    const [day, month, year] = r.date.split(".");
    const resDate = new Date(year, month - 1, day);
    return resDate >= today;
  });

  localStorage.setItem("reservations", JSON.stringify(validReservations));
}


function saveReservation(reservation) {
  const reservations = getReservations();
  reservations.push(reservation);
  localStorage.setItem("reservations", JSON.stringify(reservations));
}

function isReserved(date, slot) {
  return getReservations().some(r => r.date === date && r.slot === slot);
}

function isDayFullyBooked(date) {
  return timeslots.every(slot => isReserved(date, slot));
}

function getUpcomingDays(count = 7) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: count }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });
}

// ======================
// KALENDÁŘ
// ======================
const calendarBody = document.getElementById("calendar-body");

function renderCalendar() {
  calendarBody.innerHTML = "";

  getUpcomingDays(7).forEach((day, index) => {
    const tr = document.createElement("tr");

    const tdDay = document.createElement("td");
    const dateString = day.toLocaleDateString("cs-CZ");
    
    tdDay.innerHTML =
  index === 0
    ? `<strong>Dnes (${day.toLocaleDateString("cs-CZ", {
        weekday: "long",
        day: "numeric",
        month: "numeric"
      })})</strong>`
    : day.toLocaleDateString("cs-CZ", {
        weekday: "long",
        day: "numeric",
        month: "numeric"
      });

    const tdSlots = document.createElement("td");

    timeslots.forEach(slot => {
       
      //!-- skrytí dnešních prošlých slotů--//
      
       if (index === 0 && !isSlotInFuture(slot)) {
       return;
      }

  const btn = document.createElement("button");
  btn.textContent = slot;

      if (isReserved(dateString, slot)) {
        btn.disabled = true;
        btn.classList.add("reserved");
      }

      btn.addEventListener("click", () => {
        pendingReservation = { date: dateString, slot };

        document.getElementById("reservation-info").textContent =
          `Datum: ${dateString}, čas: ${slot}`;

        document
          .getElementById("reservation-overlay")
          .classList.remove("hidden");
      });

      tdSlots.appendChild(btn);
    });

    tr.appendChild(tdDay);
    tr.appendChild(tdSlots);
    calendarBody.appendChild(tr);
  });
}


cleanOldReservations();
renderCalendar();

// ======================
// POTVRDIT
// ======================
const confirmBtn = document.getElementById("confirm-reservation");
if (confirmBtn) {
  confirmBtn.addEventListener("click", () => {
    if (!pendingReservation) {
      alert("Nejprve vyber časový slot");
      return;
    }

    const name = document.getElementById("res-name").value.trim();
    const phone = document.getElementById("res-phone").value.trim();

    if (!name || !phone) {
      alert("Vyplň jméno a telefon");
      return;
    }

    saveReservation({
      ...pendingReservation,
      name,
      phone
    });

    sendTelegramMessage(
      `🔥 Nová rezervace sauny\n📅 ${pendingReservation.date}\n⏰ ${pendingReservation.slot}\n👤 ${name}\n📞 ${phone}`
    );

    pendingReservation = null;

    document.getElementById("reservation-overlay").classList.add("hidden");
    document.getElementById("res-name").value = "";
    document.getElementById("res-phone").value = "";

    renderCalendar();
  });
}

// ======================
// ZRUŠIT
// ======================
const cancelBtn = document.getElementById("cancel-reservation");
if (cancelBtn) {
  cancelBtn.addEventListener("click", () => {
    pendingReservation = null;
    document.getElementById("reservation-overlay").classList.add("hidden");
  });
}
