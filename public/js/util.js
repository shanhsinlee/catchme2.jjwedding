//-------client-------//

var sSubmitThreshold = 3000;

function isLogin(){
    var isLogin = (isCookieExist('uid') && isCookieExist('uname'));
    if (!isLogin) {
        deleteCookie('uid');
        deleteCookie('uname');
        deleteCookie('game1_legend');
    }
    return isLogin;
}

function setCookie(cname, cvalue) {
    var d = new Date();
    d.setTime(d.getTime() + (1*24*60*60*1000));//(1*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + escape(cvalue) + "; " + expires;
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
            return unescape(c.substring(name.length, c.length));
        }
    }
    return "";
}

function isCookieExist(cname){
    var value = getCookie(cname);
    if (value!="") return true;
    else return false;
}

function submitToServer(action, value){
	var post_url = 'user/'+getCookie('uid')+'/submit';
	
	var success = false;

	$.post( post_url, { action: action, value: value } )
		.success( function (json){
			success = true;
            submitCallback(success, json);
		})
		.error( function (json){
			success = false;
            if (json==null) json = parseJSON('{"msg":"連線失敗"}');
            submitCallback(success, json);
		});
		//.done( function (json) {
			//return success;
            // if (json==null) json = parseJSON('{"msg":"連線失敗"}');
            // submitCallback(success, json);
		//} );

}


