function openUrl(action, value){
	var post_url = 'submit';
	
	var success = false;

	$.getJSON( "submit", { action: action, value: value } )
		.done( function (json){
			if (json.code==1) {
				success = true;
			} 
		} )
		.always( function () {
			return success;
		} )
	/*
	$.ajax({
		type: 'POST',
		url: post_url, 
		data: { 'action':action, 'value':value },
		success: function(msg) {
			alert(msg);
			return true;
		},
		error: function(request, state, thrown){
			return false;
		}
	});
	return false;
	*/
}