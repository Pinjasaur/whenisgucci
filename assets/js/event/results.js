$(function() { // document ready
  var event = __GLOBALS__.event;
  var responses = __GLOBALS__.responses;

  console.log(responses);

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
    eventLimit: true,
    visibleRange: {
     start: moment(event.startDate).add(1, 'day').format("YYYY-MM-DD"),
     end: moment(event.endDate).add(1, 'day').format("YYYY-MM-DD")
    },
    events: event.timesSelected
  };

  navBurgerify();
  modalVisibility();

  var calendar = $('#calendar');

  overLapTimes(event, responses, calendar);

  calendar.fullCalendar(calendarConfig);
});

function overLapTimes(inEvent, timeResponse, inCalendar){
  console.log("OT - Events: ", inEvent);

  var numResponse = timeResponse.length;

  console.log("OT - Num of responses: ", numResponse);
  console.log("OT - Responses: ", timeResponse);

  var workingTimes = [];

  var timesSelected = inEvent.timesSelected;

  var numTimes = timesSelected.length;

  for (var i = 0; i < numResponse; i++) {
    for (var j = 0; j < numTimes; j++) {

      if( timeResponse[i] === timesSelected[j] ){
        workingTimes.push(timeResponse[i]);
      }

    }
  }

  if(!workingTimes.length){
    console.log("OT - There weren't any times that worked, calling findAltTime");
    findAltTime(timeResponse);
  }

  console.log("OT - Working times: ", workingTimes);

}

function findAltTime(timeResponse){
  var numResponse = timeResponse.length;
  var overlap = 0;
  var altTimes = [];

  for (var i = 0; i < numResponse; i++) {
    for (var j = i; j < numResponse; j++) {

      if( timeResponse[i] === timeResponse[j] ){
        altTimes.push(timeResponse[i]);
      }

    }
  }

}

function modalVisibility(){
  $('#event-link-button').click( function func(){
    $('#event-link-modal').addClass('is-active');
  });

  $('#close-modal').click(function func(){
    $('#event-link-modal').removeClass('is-active');
  });

  $('#cancel-modal').click(function func(){
    $('#event-link-modal').removeClass('is-active');
  });
}

function navBurgerify(){
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
}
