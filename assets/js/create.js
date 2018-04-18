var events = [];
var title="";
var fromDate = "";
var toDate = "";
var freeStart = "";

$(document ).ready(function() { // document ready
  new ClipboardJS('.btn'); // needed for ClipboardJS
  $('#from-datepicker').val(moment().format("YYYY-MM-DD"));
  $('#to-datepicker').val(moment().add(7, 'days').format("YYYY-MM-DD"));


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

    document.getElementById("from-date").onclick = function func(){
      document.getElementById("from-datepicker").classList.toggle('nav-datepicker');
      document.getElementById("from-datepicker").classList.toggle('fadeInLeft');
    }

    document.getElementById("to-date").onclick = function func(){
      document.getElementById("to-datepicker").classList.toggle('nav-datepicker');
      document.getElementById("to-datepicker").classList.toggle('fadeInLeft');
    }

    $('#create-send-button').click( function func(){
      events = $('#calendar').fullCalendar('clientEvents');
      title = $('#event-title').val();
      var calendarView = $('#calendar').fullCalendar('getView');
      var startView = calendarView.start;
      var endView = calendarView.end;
      freeStart = "";

      $(".title").text(title);

      $(".startDate").text(startView.format("MM/DD/YYYY"));

      $(".endDate").text(endView.subtract(1, 'day').format("MM/DD/YYYY"));

      for(i = (events.length - 1); i >= 0; i--){
        date1 = events[i].start._d;
        console.log(date1);
        mon = ("0"+(date1.getMonth()+1)).slice(-2);
        day = ("0" + date1.getDate()).slice(-2);
        year = date1.getFullYear();
        hours = ("0" + (date1.getHours() + 4)).slice(-2);
        min = ("0" + date1.getMinutes()).slice(-2);
        date2 = events[i].end._d;
        console.log(date2);
        mon2 = ("0"+(date2.getMonth()+1)).slice(-2);
        day2 = ("0" + date2.getDate()).slice(-2);
        year2 = date2.getFullYear();
        hours2 = ("0" + (date2.getHours() + 4)).slice(-2);
        min2 = ("0" + date2.getMinutes()).slice(-2);

        freeStart =  "<li>" + mon +"/"+ day +"/"+ year + " "
                     + hours + ":" + min + " to "
                     + mon2 +"/"+ day2 +"/"+ year2 + " "
                     + hours2 + ":" + min2 + "</li>" + freeStart ;

      }
      $(".freeTimeStart").html(freeStart);


      $('#create-send-modal').addClass('is-active');
    });

    $('#close-modal').click(function func(){
      $('#create-send-modal').removeClass('is-active');
    });

    $('#cancel-modal').click(function func(){
      $('#create-send-modal').removeClass('is-active');
    });

    $('#from-datepicker').on('change', function func() {

      var currentDate = moment($('#from-datepicker').val());

      $('#calendar').fullCalendar('destroy');
      calendarConfig.visibleRange ={
        start: currentDate,
          end: currentDate.clone().add(7, 'days') // exclusive end, so 3
        };


        calendar.fullCalendar(calendarConfig);
        $('#calendar').fullCalendar('render');
        console.log(calendarConfig);
      });

    $('#to-datepicker').on('change', function func() {
      var startDate = moment($('#from-datepicker').val());

      if (startDate == undefined){
        startDate = moment();
      }
      console.log("This is your current date from 'from': ", startDate);

      var endDate = moment($('#to-datepicker').val());


      $('#calendar').fullCalendar('destroy');
      calendarConfig.visibleRange ={
        start: startDate,
        end: endDate.add(1, 'day')
      };


      calendar.fullCalendar(calendarConfig);
      $('#calendar').fullCalendar('render');
      console.log(calendarConfig);
    });

    var calendar = $('#calendar');
    calendar.fullCalendar(calendarConfig);

    $('#modal-form').on("submit", createEvent);
  });


function createEvent(event){

  event.preventDefault();

  var validEvents = [];
  var view = $('#calendar').fullCalendar('getView');
  var j = 0;
  var title;
  var repEmails = [];
  var creatorEmail;

  if (events.length === 0) {
    alert("No Events Found");
    return false;
  }


  for (i = 0; i < events.length; i++) {
    if(events[i].start._d > view.start._d){
      if(events[i].end._d <= view.end._d){
        validEvents[j] = {startDate:events[i].start.toISOString(),endDate:events[i].end.toISOString()};
        j++;
      }// end if
    }// end if
  }// end for


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
    startDate: view.start.toISOString(),
    endDate: view.end.toISOString(),
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

function popUpFunc() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
}
function popUpFunc2() {
    var popup = document.getElementById("myPopup2");
    popup.classList.toggle("show");
}
