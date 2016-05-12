//-------server-------//
var sPullingThreshold = 1000;

function pullingFromServer(action, callback){
	var post_url = 'server/'+action+'/rank';

    $.getJSON(post_url, function(json){
        callback(json);
    });
}

