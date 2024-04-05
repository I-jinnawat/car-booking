document.addEventListener("DOMContentLoaded", function () {
  var calendarEl = document.getElementById("calendar");
  var calendar = new FullCalendar.Calendar(calendarEl, {
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
    },
    navLinks: true, // can click day/week names to navigate views
    // editable: true,
    selectable: true,
    events: "/events", // Fetch events from backend on load
    eventClick: function (info) {
      // Handle event click if needed
      console.log(info);
    },
  });
  calendar.render();
});
