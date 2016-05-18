//-------server-------//
var sPullingThreshold = 5000;

function pullingFromServer(game, callback){
	var post_url = 'rank/'+game;

    $.getJSON(post_url, function(json){
        callback(json);
    });
}

function toggle(game, callback){
    var post_url = 'toggle/'+game;

    $.post(post_url, function(json){
        callback(json);
    });
}
