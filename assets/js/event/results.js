$(function() { // document ready
  var event = __GLOBALS__.event;
  var responses = __GLOBALS__.responses;

  navBurgerify();
  modalVisibility();

  var workingTimes = overLapTimes(event, responses, calendar);

  var calendar = $('#calendar');
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
    events: workingTimes
  };

  calendar.fullCalendar(calendarConfig);
});

function overLapTimes(inEvent, responses, inCalendar){
  // console.log("OT - Events: ", inEvent);

  var numResponse = responses.length;
  var responseTimes = [];

  responses.forEach( function(response) {
    response.timesSelected.forEach( function(time){
      responseTimes.push(time);
    });
  });

  var numTimes = responseTimes.length;

  // console.log("OT - Num of responses: ", numResponse);
  // console.log("OT - Responses: ", responses);

  // console.log("OT - Num of times: ", numTimes);
  console.log("OT - Response times: ", responseTimes)

  var workingTimes = [];

  var masterTimes = inEvent.timesSelected;
  var numMasterTimes = masterTimes.length;

  console.log("OT - Master Times selected: ", masterTimes);

  for (var j = 0; j < numTimes; j++) {
    for (var k = 0; k < numMasterTimes; k++) {
      if( timeCompare(responseTimes[j], masterTimes[k]) ){
        workingTimes.push(getClampedTime(masterTimes[k], responseTimes[j]));
      }
    }
  }

  if(!workingTimes.length){
    // console.log("OT - There weren't any times that worked, calling findAltTime");
    findAltTime(responses);
  }

  console.log("OT - Working times: ", workingTimes);

  return workingTimes;

}

function findAltTime(responses){
  var numResponse = responses.length;
  var overlap = 0;
  var altTimes = [];

  for (var i = 0; i < numResponse; i++) {
    for (var j = i; j < numResponse; j++) {

      if( responses[i] === responses[j] ){
        altTimes.push(responses[i]);
      }

    }
  }

}

function clamp(value, min, max) {
  return Math.min(Math.max(min, value), max);
}

function timeCompare(masterTime, responseTime){
  // Master time; valueOf converts to millisecond
  var mStart = moment(masterTime.start).valueOf();
  var mEnd = moment(masterTime.end).valueOf();

  // Response time; valueOf converts to millisecond
  var rStart = moment(responseTime.start).valueOf();
  var rEnd = moment(responseTime.end).valueOf();

  if (rEnd < mStart || rStart > mEnd){
    return false;
  }

  return true;
}

function getClampedTime(masterTime, responseTime){
  // Master time; valueOf converts to millisecond
  var mStart = moment(masterTime.start).valueOf();
  var mEnd = moment(masterTime.end).valueOf();

  // Response time; valueOf converts to millisecond
  var rStart = moment(responseTime.start).valueOf();
  var rEnd = moment(responseTime.end).valueOf();

  console.log("mStart: ", mStart);
  console.log("mEnd: ", mEnd);

  var clampedStart = clamp(rStart, mStart, mEnd);
  var clampedEnd = clamp(rEnd, mStart, mEnd);

  console.log("clampedStart: ", clampedStart);
  console.log("clampedEnd: ", clampedEnd);

  console.log({
    start: moment(clampedStart).format(),
    end: moment(clampedEnd).format()
  });

  return {
    start: moment(clampedStart).format(),
    end: moment(clampedEnd).format()
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
