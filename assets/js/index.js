var codeInputStatus = false; // false being closed

$( ".codeButton" ).click(function() {
  if(codeInputStatus == true){
    $(".codeInput").animate({width: '0px'}, 1000)
  //  $("#codeInput").animate({visibility: 'hidden'}, 2000)
    codeInputStatus = false;
  }// end if
  else{
    $(".codeInput").animate({width: '200px'}, 1000)
    codeInputStatus = true;
  }// end else

}); // end click function
