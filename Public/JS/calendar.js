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
