var ytPlayer;
            function onYouTubePlayerReady(playerId) {
                ytPlayer = document.getElementById("videoPlayer");
            }

function search(keyword, order) {
    // alert("recherche en cours");
    var contentElement = $('#searchBox .content');
    contentElement.html("Recherche en cours...");
    if (order == null) {
        order = "relevance";
    }
    $.ajax({
        type:"GET",
        url: "http://gdata.youtube.com/feeds/api/videos?q=" + encodeURIComponent(keyword)+ "&format=5&start-index=1&orderby=" + order + "&max-results=30&v=2&alt=jsonc",
        dataType:"jsonp"
    })
    .success(function(response, textStatus, jqXHR) {
        //console.log(response);
        contentElement.html("");
        if ("undefined" != typeof response.data.items && response.data.items.length > 0) {
            for (var i = response.data.items.length - 1; i >= 0; i--) {
                item =  response.data.items[i];
                contentElement.append(''
                    + '<div class="video-list-item clearfix">'
                    + '<img src="' + item.thumbnail.sqDefault + '" alt="' + item.title + '" />'
                    + '<div class="video-list-item-title">'
                    + item.title
                    + '</div>'
                    + '<button class="play-video-button" data-id="' + item.id+ '">Lire video</button>'
                    + '</div>'
                );
            };
        } else {
            contentElement.html("Aucun resultat trouve.");
        }
    })
    .error(function() {
        contentElement.html("Erreur lors de la requete.");
    });
}

function loadVideoPlayer() {
    var params = { allowScriptAccess: "always", wmode:"transparent" };
    var atts = { id: "videoPlayer" };
    var width = $("#playerBox").width() - 50;
    var height = $(window).height() - $("#header").height() - 50;
    swfobject.embedSWF("http://www.youtube.com/apiplayer?version=3&enablejsapi=1&playerapiid=player1","video", width , height, "9", null, null, params, atts);
}

function playVideo(videoId) {
    if (null != ytPlayer) {
        ytPlayer.cueVideoById(videoId);
        ytPlayer.playVideo();
    } else {
        alert("Patientez, chargement du lecteur Youtuube en cours.");
    }
}

$(document).ready(function() {
    loadVideoPlayer();
    $('#searchBox form').live('submit', function() {
        //alert('execution de la recherche');
        var keyword = $("#keyword").val().trim();
        search(keyword);
        return false;
    });
    $('.play-video-button').live('click', function() {
        playVideo($(this).data('id'));
    });
});
