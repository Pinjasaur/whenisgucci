$(function() { // document ready
  new ClipboardJS('.copy-btn'); // needed for ClipboardJS
  $('.copy-btn').on('click', copyMessageToolTip);

  // initialize the datepicker values to the current day to a week view
  $('#from-datepicker').val(moment().format("YYYY-MM-DD"));
  $('#to-datepicker').val(moment().add(6, 'days').format("YYYY-MM-DD"));


  var calendarConfig = {
    header: {
      left: '',
      center: 'title',
      right: 'agendaDay'
    },
    timezone: 'local',
    selectable: true,
    defaultView: 'agenda',
    minTime: "07:00:00",
    maxTime: "21:00:00",
    allDaySlot: false,
    editable: true,
    contentHeight:Function,
    eventLimit: true,
    visibleRange: {
      start: moment().format("YYYY-MM-DD"),
      end: moment().add(7, 'days').format("YYYY-MM-DD")
    },
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
    }
  };

  // makes sure the nav will burger and unfold on the proper size view
  navBurgerify();

  // makes the date picker/inputs come out and look all shnazzy
  datePickerAnimate();

  // this will create the "Create & Submit" modal and handle it's closings
  // aka it's comings and goings
  // this function is a weird, stalkery partner
  createModal();

  // when the date inputs change, update the calendar config and reconstruct it
  calendarDateUpdate();

  $('#calendar').fullCalendar(calendarConfig);

  $('#modal-form').on("submit", createEvent);
});

function datePickerAnimate(){

  $("#from-date").on('click', function(){
      $("#from-datepicker").toggleClass('nav-datepicker fadeInLeft');
  });

   $("#to-date").on('click', function(){
      $("#to-datepicker").toggleClass('nav-datepicker fadeInLeft');
  });

}

function createModal(){
  $('#create-send-button').click( function func(){
    title = $('#event-title').val();
    if(!title.trim()){
      $('#no-title-modal').addClass('is-active');;
      return -1;
    }
    events = $('#calendar').fullCalendar('clientEvents');
    var calendarView = $('#calendar').fullCalendar('getView');
    var startView = calendarView.start;
    var endView = calendarView.end;

    $(".title").text(title);

    $(".startDate").text(startView.format("MM/DD/YYYY"));

    $(".endDate").text(endView.subtract(1, 'day').format("MM/DD/YYYY"));

    $(".freeTimeStart").empty();

    events.forEach(function(event) {

      var start = event.start.format("MM/DD/YYYY HH:mm");
      var end = event.end.format("MM/DD/YYYY HH:mm");

      var $el = $("<li>");
      $el.text(start + " to " + end);
      $(".freeTimeStart").append($el);
    });

    $('#create-send-modal').addClass('is-active');
  });

  $('#close-modal').click(function func(){
    $('#create-send-modal').removeClass('is-active');
  });

  $('#cancel-modal').click(function func(){
    $('#create-send-modal').removeClass('is-active');
  });
}

function calendarDateUpdate(){
      $('#from-datepicker').on('change', function func() {
      var startDate = moment($('#from-datepicker').val());
      var endDate = moment($('#to-datepicker').val());

      $('#calendar').fullCalendar('destroy');
      calendarConfig.visibleRange ={
        start: startDate,
        end: endDate.add(1, 'day')
      };

      calendar.fullCalendar(calendarConfig);
      $('#calendar').fullCalendar('render');
      });

    $('#to-datepicker').on('change', function func() {
      var startDate = moment($('#from-datepicker').val());
      var endDate = moment($('#to-datepicker').val());

      $('#calendar').fullCalendar('destroy');
      calendarConfig.visibleRange ={
        start: startDate,
        end: endDate.add(1, 'day')
      };

      calendar.fullCalendar(calendarConfig);
      $('#calendar').fullCalendar('render');
      console.log(endDate);
    });
}

function createEvent(event){

  event.preventDefault();

  var startView = moment($('#from-datepicker').val());
  var endView = moment($('#to-datepicker').val());
  var validEvents = $('#calendar').fullCalendar('clientEvents', function(event){
    return event.start.isSameOrAfter(startView) && event.end.isSameOrBefore(endView);
  });
  var title;
  var repEmails = [];
  var creatorEmail;

  if (events.length === 0) {
    alert("No Events Found");
    return false;
  }

  // making sure that the properties are consistent and appropriate!
  validEvents = validEvents.map( function(event){
    return {
        startDate: event.start.toISOString(),
        endDate: event.end.toISOString()
      };
  });

  title = $('#event-title').val();
  if(!title.trim()){
    alert("Please Enter a Title");
  }

  creatorEmail = $("#creator-email").val();
  if(!creatorEmail.trim()){
    alert("Please Enter Your Email");
  }

  repEmails = $("#invited-to-email").val().split(',');

  var data = {
    startDate: startView.toISOString(),
    endDate: endView.toISOString(),
    events: validEvents,
    title: title,
    createdBy: creatorEmail,
    invitedTo: repEmails
  };

  $.ajax({
    url:"/api/event/create",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(data),
    success: function(res){
      console.log(res);
      var toEmails = $("#invited-to-email").val()
      var sendLink = "gucci4.me/" + res.result.event.id;
      var eventLink = "whenisgucci.com/" +"event/" + res.result.event.id + "/results";
      document.getElementById("eventLink").setAttribute("href","https://www." + eventLink);
      document.getElementById("sendLink").setAttribute("href","https://www." + sendLink);
      $("#eventCode").html(res.result.event.id);
      $("#creator").html(creatorEmail);
      $(".sentTo").html(toEmails);
      $("#sendLink").html(sendLink);
      $("#eventLink").html(eventLink);
      $('#create-send-modal').removeClass('is-active');
      $('#save-success-modal').addClass('is-active');
    },
    error: function(err){
      console.log(err.message);
    }

  })
}

$('#newEvent').click( function func(){
  window.location = window.location.href;
  window.location.reload(true);
})

function copyMessageToolTip(){
  var $this = $(this);
  $this.find('.popup-text').addClass("show");
  setTimeout(function(){
    $this.find('.popup-text').removeClass("show");
  }, 2000);
}
