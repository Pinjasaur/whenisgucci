$(function() { // document ready
  var event = __GLOBALS__.event;
  var responses = __GLOBALS__.responses;

  new ClipboardJS('.copy-btn'); // needed for ClipboardJS
  $('.copy-btn').on('click', copyMessageToolTip);
  $('#event-code').val('gucci4.me/' + event.id);

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
     start: moment(event.startDate).format("YYYY-MM-DD"),
     end: moment(event.endDate).format("YYYY-MM-DD")
    },
    events: workingTimes
  };

  calendar.fullCalendar(calendarConfig);

});

function overLapTimes(inEvent, responses, inCalendar){

  var numResponse = responses.length;
  var responseTimes = [];

  responses.forEach( function(response) {
    response.timesSelected.forEach( function(time){
      responseTimes.push(time);
    });
  });

  var numTimes = responseTimes.length;

  var workingTimes = [];

  var masterTimes = inEvent.timesSelected;
  var numMasterTimes = masterTimes.length;


  for (var j = 0; j < numTimes; j++) {
    for (var k = 0; k < numMasterTimes; k++) {
      if( timeCompare(responseTimes[j], masterTimes[k]) ){
        workingTimes.push(getClampedTime(masterTimes[k], responseTimes[j]));
      }
    }
  }

  if(!workingTimes.length){
    // console.log("OT - There weren't any times that worked, calling findAltTime");
    // findAltTime(responses);
    alert("No working times were found");
  }

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

  // Making sure that it is possible for overlap
  if (rEnd < mStart || rStart > mEnd){
    return false;
  }

  // Making sure that edges aren't the same
  if (rStart === mEnd || rEnd === mStart){
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

  var clampedStart = clamp(rStart, mStart, mEnd);
  var clampedEnd = clamp(rEnd, mStart, mEnd);


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
