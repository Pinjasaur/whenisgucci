$(document ).ready(function() { // document ready
  var calendarConfig = {
      header: {
        left: '',
        center: 'title',
        right: 'agendaWeek,agendaDay'
      },
      selectable: true,
      defaultView: 'agendaWeek',
      minTime: "07:00:00",
      maxTime: "21:00:00",
      allDaySlot: false,
      editable: true,
      contentHeight:Function,
      eventLimit: true,
      visibleRange: moment(),
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

  // $('#from-datepicker').on('change', function func() {

  //   var currentDate = moment($('#from-datepicker').val());
  //   console.log("This is your current date from 'from': ", currentDate);

  //   // $('#calendar').fullCalendar('changeView', 'agendaWeek', {
  //   //   start: currentDate,
  //   //   end: currentDate.clone().add(7, 'days')
  //   // });

  //   $('#calendar').fullCalendar('destroy');
  //   calendarConfig.visibleRange ={
  //         start: currentDate,
  //         end: currentDate.clone().add(7, 'days') // exclusive end, so 3
  //       };


  //   calendar.fullCalendar(calendarConfig);
  //   $('#calendar').fullCalendar('render');
  //   console.log($('#calendar').fullCalendar('getCalendar'));
  //   console.log(calendarConfig);
  // });

  // $('#to-datepicker').on('change', function func() {
  //   $('#calendar').fullCalendar('destroy');
  //   $('#calendar').fullCalendar('render');
  // });

  var calendar = $('#calendar');
  calendar.fullCalendar(calendarConfig);
});
