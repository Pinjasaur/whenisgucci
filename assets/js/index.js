var codeInputStatus = false; // false being closed
checkURL();
$( ".codeButton" ).click(function() {
  if(codeInputStatus === true){
    $(".codeInput").animate({width: '0px' , padding: '0px'}, 1000)
    $("#inputCode").animate({padding: '0px'},1000);
    codeInputStatus = false;
  }// end if
  else{
    $(".codeInput").animate({width: '100px', padding: '5px'}, 1000)
    $("#inputCode").animate({padding: '5px'},1000);
    codeInputStatus = true;
  }// end else

}); // end click function

$('#close-modal').click(function func(){
  $('#invalid-code-modal').removeClass('is-active');
});

$('#close-modal-id').click(function func(){
  $('#invalid-id-modal').removeClass('is-active');
});

function submitEventCode(code){
  if(event.which === 13) {
    data = {id:code.value};

    $.ajax({
      url:"/api/event/verify-code",
      method: "GET",
      contentType: "application/json",
      data: data,
      success: function(res){
        if(res.status){
          url = "https://whenisgucci.com/event/" + code.value + "/respond?utm_source=eventcode";
          location.href = url;
        }
      },
      error: function(err){
        document.getElementById("inputCode").setAttribute("class", "input is-danger");
        $('#invalid-code-modal').addClass('is-active');
      }

    }) // end of ajax request

  }// end if
}// end of submitEventCode

function checkURL(){
  if(window.location.href.indexOf("invalid-code=1") > -1) {
    // code not even close. Doesn't pass regular expression.
    $('#id-header').html("Invalid Event Code");
    $('#invalid-title').html("Your Event Code Is Not Valid!");
    $('#invalid-msg').html("please check to make sure you have the correct event code")
    $('#invalid-id-modal').addClass('is-active');
  }else if(window.location.href.indexOf("invalid-code=2") > -1){
    // code couldn't be decoded
    $('#id-header').html("Invalid Event Code");
    $('#invalid-title').html("Your Event Code Is Not Valid!");
    $('#invalid-msg').html("please check to make sure you have the correct event code")
    $('#invalid-id-modal').addClass('is-active');
  }else if(window.location.href.indexOf("invalid-code=3") > -1){
    // Event Not Found in DB.
    $('#id-header').html("Event Does Not Exist");
    $('#invalid-title').html("Your Event Does Not Exist!");
    $('#invalid-msg').html("please check to make sure you have the correct event code")
    $('#invalid-id-modal').addClass('is-active');
  }

}
