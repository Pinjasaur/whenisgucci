$(function() { // document ready
  var event = __GLOBALS__.event;

  console.log(event);

  var masterEvents = [];
  var id = 0;

  event.timesSelected.forEach( function(time){
    var ev = {
      start: time.start,
      end: time.end,
      rendering: 'background',
      isMasterEvent: true
    }
    masterEvents.push(ev);
    id++;
  });

    console.log(masterEvents);


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
     start: moment(event.startDate).add(1, 'day').format("YYYY-MM-DD"),
     end: moment(event.endDate).add(1, 'day').format("YYYY-MM-DD")
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

  var calendar = $('#calendar');


  calendar.fullCalendar(calendarConfig);

  $('#respond-form').on("submit", createResponse);
});

function createResponse(){
  event.preventDefault();

  var responseEvents = [];
  var events = $('#calendar').fullCalendar('clientEvents');
  var view = $('#calendar').fullCalendar('getView');
  var respondEmail;
  var respondName;

  if (events.length === 0) {
    alert("No Response Found");
    return false;
  }

  for (i = 0; i < events.length; i++) {
    if(events[i].start._d > view.start._d){
      if(events[i].end._d <= view.end._d){
        responseEvents.push(
          {
            startDate: events[i].start.toISOString(),
            endDate: events[i].end.toISOString(),
            isMasterEvent: events[i].isMasterEvent
          });
      }// end if
    }// end if
  }// end for

  respondEmail = $("#respond-email").val();
  if(!respondEmail.trim()){
    alert("Please Enter Your Email");
  }

  respondName = $("#respond-name").val();

  console.log('pre prune: ', responseEvents);

  responseEvents = responseEvents.filter( function(element){
    return !element.isMasterEvent;
  });

  console.log(responseEvents);

  var data = {
    id: __GLOBALS__.event.id,
    events: responseEvents,
    email: respondEmail,
    name: respondName
  };

  console.log("This is in the ajax: ", data);

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
