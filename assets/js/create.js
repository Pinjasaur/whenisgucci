// to create the hamburger when viewport is some size
document.addEventListener('DOMContentLoaded', function () {

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
});

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



$(document ).ready(function() { // document ready
  var calendar = $('#calendar');
    calendar.fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'agendaWeek,agendaDay'
      },
      selectable: true,
      defaultDate: '2018-03-18',
      defaultView: 'agendaWeek',
      minTime: "07:00:00",
      maxTime: "21:00:00",
      allDaySlot: false,
      editable: true,
      contentHeight:Function,
      eventLimit: true,
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
    });
});

document.getElementById("to-date").onclick = function func(){
  document.getElementById("to-datepicker").classList.toggle('nav-datepicker');
  document.getElementById("to-datepicker").classList.toggle('fadeInLeft');
}

$(function() { // document ready
  var calendar = $('#calendar');
   calendar.fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'agendaWeek,agendaDay'
    },
    selectable: true,
    defaultDate: '2018-03-18',
    defaultView: 'agendaWeek',
    minTime: "07:00:00",
    maxTime: "21:00:00",
    allDaySlot: false,
    editable: true,
    contentHeight:Function,
    eventLimit: true,
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
    }
  });

});
