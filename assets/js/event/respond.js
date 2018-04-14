
function populateChart(inEvent, inResponses, inCalendar){
  console.log(inEvent);
  console.log(inResponses);

  console.log("Times selected - Pop Chart: " , inEvent.timesSelected);
  inCalendar.fullCalendar({
    header: {
      left: '',
      center: 'title',
      right: ''
    },
    defaultView: 'agenda',
    minTime: "07:00:00",
    maxTime: "21:00:00",
    allDaySlot: false,
    editable: true,
    eventLimit: true,
    visibleRange: {
     start: moment(inEvent.startDate).format("YYYY-MM-DD"),
     end: moment(inEvent.endDate).add(1, 'day').format("YYYY-MM-DD")
    },
    events: inEvent.timesSelected
  });

}

$(document ).ready(function() { // document ready
  var event = __GLOBALS__.event;
  var responses = __GLOBALS__.responses;

  console.log("event - timesSelected: ", event.timesSelected);

  var calendarConfig = {
    header: {
      left: '',
      center: 'title',
      right: ''
    },
    defaultView: 'agenda',
    minTime: "07:00:00",
    maxTime: "21:00:00",
    allDaySlot: false,
    editable: true,
    eventLimit: true,
    visibleRange: {
     start: moment(event.startDate).format("YYYY-MM-DD"),
     end: moment(event.endDate).add(1, 'day').format("YYYY-MM-DD")
    },
    events: event.timesSelected
  };


  // to create the hamburger when viewport is some size
  // Get all "navbar-burger" elements
  var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {

    // Add a click event on each of them
    $navbarBurgers.forEach(function ($el) {
      $el.addEventListener('click', function () {

        // Get the target from the "data-target" attribute
        var target = $el.dataset.target;
        var $target = document.getElementById(target);

        // Toggle the class on both the "navbar-burger" and the "navbar-menu"
        $el.classList.toggle('is-active');
        $target.classList.toggle('is-active');

      });
    });
  }

  $('#event-link-button').click( function func(){
    $('#event-link-modal').addClass('is-active');
  });

  $('#close-modal').click(function func(){
    $('#event-link-modal').removeClass('is-active');
  });

  $('#cancel-modal').click(function func(){
    $('#event-link-modal').removeClass('is-active');
  });

  var calendar = $('#calendar');
  // populateChart(event, responses, calendar);
  calendar.fullCalendar(calendarConfig);
});
