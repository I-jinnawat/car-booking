$(document).ready(function () {
  $("#calendar").fullCalendar({
    header: {
      left: "prev,next today",
      center: "title",
      right: "month,listYear",
    },
    displayEventTime: false, // don't show the time column in list view

    // THIS KEY WON'T WORK IN PRODUCTION!!!
    // To make your own Google API key, follow the directions here:
    // http://fullcalendar.io/docs/google_calendar/
    googleCalendarApiKey: "AIzaSyDoOJthwYaVfBAIlpIuNKsD-1jKxzmJE5Q", //Add Key API
    // US Holidays
    events:
      "c_15ddc5703bec5e6bd3c6f686047a20f007e3daab3fb355c400869dce023d63b8@group.calendar.google.com", //Add Calendar ID
    eventClick: function (event) {
      // opens events in a popup window
      alert(event.title);
      return false;
    },

    loading: function (bool) {
      $("#loading").toggle(bool);
    },
  });
});
