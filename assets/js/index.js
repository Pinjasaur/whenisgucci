var codeInputStatus = false; // false being closed

$( ".codeButton" ).click(function() {
  if(codeInputStatus === true){
    $(".codeInput").animate({width: '0px' , padding: '0px'}, 1000)
    $("#inputCode").animate({padding: '0px'},1000);
  //  $("#codeInput").animate({visibility: 'hidden'}, 2000)
    codeInputStatus = false;
  }// end if
  else{
    $(".codeInput").animate({width: '100px', padding: '5px'}, 1000)
    $("#inputCode").animate({padding: '5px'},1000);
    codeInputStatus = true;
  }// end else

}); // end click function


function submitEventCode(code){
  if(event.which === 13) {
      url = "https://whenisgucci.com/event/" + code.value + "/respond";
      location.href = url;
  }
}
