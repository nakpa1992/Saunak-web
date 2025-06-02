const timeslots = [
    `16:00 - 18:00`,
    `18:30 - 20:30`
];

function getWeekDays () {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    //vypocet pondeli tohoto tydne (pondeli je nula)
    monday.setDate(today.getDate() - ((dayOfWeek +6) % 7));

        let days = [];
        for(let i = 0; i < 7; i++) {
            const d = new Date(monday);
        d.setDate(monday.getDate() +i);
        days.push(d);
}
    return days;
}

const calendarBody = document.getElementById(`calendar-body`);
let selected = null;

    function renderCalendar() {
        const days = getWeekDays();
        calendarBody.innerHTML = ``;

        days.forEach(day => {
            const tr = document.createElement(`tr`);

            //den v tydnu a datum

            const tdDay = document.createElement(`td`);
            tdDay.textContent = day.toLocaleDateString(`cs-CZ`, {weekday:`long`, day: `numeric`, month: `numeric`});

             // Časové sloty
    const tdSlots = document.createElement('td');
    timeslots.forEach(slot => {
      const btn = document.createElement('button');
      btn.textContent = slot;

      btn.addEventListener('click', () => {
        if (selected) {
          selected.classList.remove('selected');
        }
        btn.classList.add('selected');
        selected = btn;
        alert(`Rezervováno na ${day.toLocaleDateString('cs-CZ')} v čase ${slot}`);
      });

      tdSlots.appendChild(btn);
    });

    tr.appendChild(tdSlots);
    calendarBody.appendChild(tr);
  });
}

renderCalendar();