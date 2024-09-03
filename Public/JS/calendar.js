document.addEventListener('DOMContentLoaded', function () {
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
    },
    navLinks: true, // can click day/week names to navigate views
    // editable: true,
    selectable: true,
    events: '/events', // Fetch events from backend on load
    eventClick: function (info) {
      console.log(info);
      document.getElementById('eventTitle').textContent =
        'หัวข้อ: ' + info.event.title;
      document.getElementById('eventbookingID').textContent =
        'รหัสการจอง: ' + info.event.extendedProps.bookingID;
      document.getElementById('event_userinfo').textContent =
        'ชื่อผู้จอง: ' + info.event.extendedProps.userinfo;
      document.getElementById('event_organization').textContent =
        'หน่วยงาน: ' + info.event.extendedProps.organization;

      // Show the modal
      $('#eventModal').modal('show');
    },
  });

  calendar.render();
});
