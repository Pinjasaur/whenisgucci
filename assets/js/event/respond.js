$(function() { // document ready
  var event = __GLOBALS__.event;

  var masterEvents = [];
  var id = 0;

  event.timesSelected.forEach( function(time){
    masterEvents.push({
      start: time.start,
      end: time.end,
      rendering: 'background',
      isMasterEvent: true
    });
    id++;
  });

  var calendarConfig = {
    header: {
      left: '',
      center: 'title',
      right: ''
    },
    timezone: 'local',
    selectable: true,
    defaultView: 'agenda',
    minTime: "07:00:00",
    maxTime: "21:00:00",
    allDaySlot: false,
    eventLimit: true,
    visibleRange: {
     start: moment(event.startDate).format("YYYY-MM-DD"),
     end: moment(event.endDate).format("YYYY-MM-DD")
    },
    events: masterEvents,
    select: function (start, end, jsEvent, view) {
      $('#calendar').fullCalendar('addEventSource', [{
        start: start,
        end: end,
        rendering: 'background',
        block: true,
      }, ]);
      $('#calendar').fullCalendar("unselect");
    },
    selectOverlap: function(event) {
      calendar.fullCalendar('unselect');
      return ! event.block;
    },
    eventRender: function(event, element) {
      element.append( "<span class='unselect-event'></span>" );
      element.find(".unselect-event").click(function() {
       $('#calendar').fullCalendar('removeEvents',event._id);
     });
    },
  };

  navBurgerify();
  modalVisibility();

  $('#calendar').fullCalendar(calendarConfig);

  $('#respond-form').on("submit", createResponse);
});

function createResponse(){
  event.preventDefault();

  var responseEvents = [];
  var clientEvents = $('#calendar').fullCalendar('clientEvents');
  var view = $('#calendar').fullCalendar('getView');

  if (clientEvents.length === 0) {
    alert("No Response Found");
    return false;
  }

  for (i = 0; i < clientEvents.length; i++) {
    if(clientEvents[i].start._d > view.start._d){
      if(clientEvents[i].end._d <= view.end._d){
        responseEvents.push(
          {
            startDate: clientEvents[i].start.toISOString(),
            endDate: clientEvents[i].end.toISOString(),
            isMasterEvent: clientEvents[i].isMasterEvent
          });
      }// end if
    }// end if
  }// end for

  var respondEmail = $("#respond-email").val();
  if(!respondEmail.trim()){
    alert("Please Enter Your Email");
  }

  var respondName = $("#respond-name").val();

  responseEvents = responseEvents.filter( function(element){
    return !element.isMasterEvent;
  });


  var data = {
    id: __GLOBALS__.event.id,
    events: responseEvents,
    email: respondEmail,
    name: respondName
  };

  $.ajax({
    url:"/api/event/respond",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(data),
    success: function(res){
      console.log(res);
      $('#response-modal').removeClass('is-active');
      $('#response-success-modal').addClass('is-active');
    },
    error: function(err){
      console.log(err.message);
    }

  })
}


function modalVisibility(){
  $('#response-button').click( function func(){
    $('#response-modal').addClass('is-active');
  });

  $('#close-modal').click(function func(){
    $('#response-modal').removeClass('is-active');
  });

  $('#cancel-modal').click(function func(){
    $('#response-modal').removeClass('is-active');
  });

  $('#close-success-modal').click(function func(){
    $('#response-success-modal').removeClass('is-active');
  });

  $('#cancel-success-modal').click(function func(){
    $('#response-success-modal').removeClass('is-active');
  });
}
