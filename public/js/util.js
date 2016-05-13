//-------client-------//

function setCookie(cname, cvalue) {
    var d = new Date();
    d.setTime(d.getTime() + (60*1000));//(1*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function deleteCookie(cname) {
    var expires = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = cname + "=" + '' + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function submitToServer(action, value){
	var post_url = 'user/'+getCookie('uid')+'/submit';
	
	var success = false;

	$.post( post_url, { action: action, value: value } )
		.done( function (json){
			success = true;
		})
		.fail( function (json){
			success = false;
		})
		.always( function () {
			return success;
		} );

}

