$(document).ajaxComplete (event, request) ->
  msg = request.getResponseHeader("X-Message")
  alert_type = 'success'
  alert_type = 'error' unless request.getResponseHeader("X-Message-Type").indexOf("error") is -1

  unless request.getResponseHeader("X-Message-Type").indexOf("keep") is 0
  	$("#flash").html("<div class='alert alert-danger alert-dismissible text-center'>
   	<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>×</button>
    <strong>"+ msg + "</strong></div>") if msg