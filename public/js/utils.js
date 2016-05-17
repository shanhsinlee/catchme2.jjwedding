//-------server-------//
var sPullingThreshold = 500;

function pullingFromServer(game, callback){
	var post_url = 'rank/'+game;

    $.getJSON(post_url, function(json){
        callback(json);
    });
}

