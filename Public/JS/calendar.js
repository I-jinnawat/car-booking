document.addEventListener("DOMContentLoaded", function () {
  // Your code here
  var calendar = document.getElementById("calendar");
  if (calendar) {
    var fullCalendar = new FullCalendar.Calendar(calendar, {
      header: {
        left: "prev,next today",
        center: "title",
        right: "month,listYear",
      },
      displayEventTime: false,
      googleCalendarApiKey: "AIzaSyDoOJthwYaVfBAIlpIuNKsD-1jKxzmJE5Q",
      events:
        "c_15ddc5703bec5e6bd3c6f686047a20f007e3daab3fb355c400869dce023d63b8@group.calendar.google.com",
      eventClick: function (event) {
        // opens events in a popup window
        alert(event.title);
        return false;
      },
      loading: function (bool) {
        document.getElementById("loading").style.display = bool
          ? "block"
          : "none";
      },
    });
    fullCalendar.render();
  }
});
document.addEventListener('DOMContentLoaded', function () {
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
    },
    navLinks: true, // can click day/week names to navigate views
    // editable: true,
    selectable: true,
    events: '/events', // Fetch events from backend on load
    eventClick: function (info) {
      // Handle event click if needed
      console.log(info);
    }
  });
  calendar.render();

  // Initialize Flatpickr for date inputs
  flatpickr("#eventStart, #eventEnd", {
    enableTime: true,
    dateFormat: "Y-m-dTH:i",
  });


});