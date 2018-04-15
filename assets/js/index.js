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

$('#close-modal').click(function func(){
  $('#invalid-code-modal').removeClass('is-active');
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
      }else{
        alert("Invalid Code");
      }
      },
      error: function(err){
        document.getElementById("inputCode").setAttribute("class", "input is-danger");
        $('#invalid-code-modal').addClass('is-active');
        console.log(err.message);
      }

    })

  }
}
