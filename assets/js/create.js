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
      $('#calendar').fullCalendar('unselect');
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
  calendarDateUpdate(calendarConfig);

  $('#calendar').fullCalendar(calendarConfig);

  $('#modal-form').on("submit", createEvent);

  $('#newEvent').on('click', function(){window.location.reload()});
});

function datePickerAnimate(){

  $("#from-date").on('click', function(){
      $("#from-datepicker").toggleClass('nav-datepicker fadeInLeft');
  });

   $("#to-date").on('click', function(){
      $("#to-datepicker").toggleClass('nav-datepicker fadeInLeft');
  });

}

function calendarDateUpdate(calendarConfig){
  $('#from-datepicker').on('change', function func() {
    var startDate = moment($('#from-datepicker').val());
    var endDate = moment($('#to-datepicker').val());

    $('#calendar').fullCalendar('destroy');
    calendarConfig.visibleRange ={
      start: startDate,
      end: endDate.add(1, 'day')
    };

    $('#calendar').fullCalendar(calendarConfig);
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

    $('#calendar').fullCalendar(calendarConfig);
    $('#calendar').fullCalendar('render');
  });
}

function createModal(){
  $('#create-send-button').click( function func(){
    title = $('#event-title').val();

    if(!title.trim()){
      alert("Please enter an event title!");
      return false;
    }

    var clientEvents = $('#calendar').fullCalendar('clientEvents');
    var calendarView = $('#calendar').fullCalendar('getView');
    var startView = calendarView.start;
    var endView = calendarView.end;

    $(".js-event-title").text(title);

    $(".startDate").text(startView.format("MM/DD/YYYY"));

    $(".endDate").text(endView.subtract(1, 'day').format("MM/DD/YYYY"));

    $(".freeTimeStart").empty();

    clientEvents.forEach(function(event) {

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

function createEvent(_e){

  _e.preventDefault();

  var startView = moment($('#from-datepicker').val());
  var endView = moment($('#to-datepicker').val()).endOf('day');

  var validEvents = $('#calendar').fullCalendar('clientEvents', function(ev){
    return ev.start.isSameOrAfter(startView) && ev.end.isSameOrBefore(endView);
  });

  if (validEvents.length === 0) {
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

  var title = $('#event-title').val();

  var repEmails = $("#invited-to-email").val().split(',');

  var creatorEmail = $("#creator-email").val();

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
      getInfo(res);
    },
    error: function(err){
      console.log(err.message);
    }
  });
  return false;
}

function getInfo(res){

  if (res.result.creator.authenticated) {
    $('#auth-user').hide();
  }

  //Emails
  var toEmails = "";
  var invitedToLength = (res.result.event.invitedTo).length;
  toEmails = res.result.event.invitedTo.join(", ");
  var creatorEmail = res.result.creator.email;

  //Links
  var sendLink = "gucci4.me/" + res.result.event.id;
  var eventLink = "whenisgucci.com/" +"event/" + res.result.event.id + "/results";
  document.getElementById("eventLink").setAttribute("href","https://www." + eventLink);
  document.getElementById("sendLink").setAttribute("href","https://www." + sendLink);
  var code = res.result.event.id;
  //Dates
  res.result.event.timesSelected.forEach(function(timesSelected) {
    var start = moment(timesSelected.start).format("MM/DD/YYYY HH:mm");
    var end = moment(timesSelected.end).format("MM/DD/YYYY HH:mm");

    var $el = $("<li>");
    $el.text(start + " to " + end);
    $(".timesSelected").append($el);
  });
  var endDate = moment(res.result.event.endDate).format("MM/DD/YYYY");
  var startDate = moment(res.result.event.startDate).format("MM/DD/YYYY");

  //Title
  var eTitle = res.result.event.title;

  //Insert into elements
  $("#eventCode").html(code);
  $(".js-event-title-success").html(eTitle);
  $(".startDate-success").html(startDate);
  $(".endDate-success").html(endDate);
  $("#creator-success").html(creatorEmail);
  $(".sentTo-success").html(toEmails);
  $("#sendLink").html(sendLink);
  $("#eventLink").html(eventLink);

  //Close create send modal, open save success modal
  $('#create-send-modal').removeClass('is-active');
  $('#save-success-modal').addClass('is-active');

  return true;
}
