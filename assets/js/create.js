$(document ).ready(function() { // document ready
  $('#from-datepicker').val(moment().format("YYYY-MM-DD"));
  $('#to-datepicker').val(moment().add(7, 'days').format("YYYY-MM-DD"));


  var calendarConfig = {
    header: {
      left: '',
      center: 'title',
      right: 'agendaDay'
    },
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
  var events = $('#calendar').fullCalendar('clientEvents');
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
        validEvents[j] = {startDate:events[i].start._d,endDate:events[i].end._d};
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

  data = {
    startDate: view.start._d,
    endDate: view.end._d,
    events: validEvents,
    title: title,
    createdBy: creatorEmail,
    invitedTo: repEmails
  };

  $.ajax({
    url:"/api/event/create",
    method: "POST",
    data: data,
    success: function(res){
      console.log(res);
    },
    error: function(err){
      console.log(err.message);
    }

  })
}
