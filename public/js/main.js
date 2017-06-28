var player;
var dataFile;
var currentVid = false;
var restart = 3;

/**
 * Initialize application
 */
var initialize = function () {
    console.log('Loaded');
    onYouTubePlayer();

    loadJSON('data/videos.json',
        function(data) {
            dataFile = data;

            for(var i = 0; i < data.length; i += 1){
                var btn = document.createElement("button");
                var t = document.createTextNode(data[i].name);
                btn.appendChild(t);

                var video_id = data[i].url.split('v=')[1];
                var ampersandPosition = video_id.indexOf('&');
                if(ampersandPosition != -1) {
                    video_id = video_id.substring(0, ampersandPosition);
                }

                if(document.querySelector("#more-videos").textContent === "Loading more video's..."){
                    document.querySelector("#more-videos").textContent = "";
                }

                btn.dataset.video = video_id;
                document.querySelector("#more-videos").appendChild(btn);
                document.querySelector("#more-videos").appendChild(document.createElement("br"));

                btn.addEventListener('click', function(e){
                    if(currentVid){
                        currentVid.disabled = false;
                    }

                    e.target.disabled = true;
                    currentVid = e.target;

                    var id = e.target.dataset.video;
                    player.loadVideoById({'videoId': id});
                });
            }
        },
        function(xhr) { console.error(xhr); }
    );
};

function loadJSON(path, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}

function onYouTubePlayer() {
    player = new YT.Player('player', {
        height: '490',
        width: '880',
        videoId: '_PYjxjNrDsw',
        playerVars: {'controls': 0, 'showinfo': 0, 'rel': 0, 'showsearch': 0, 'iv_load_policy': 3},
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerStateChange(event) {
    console.log('event', event);

    if(event.data === 0) {
        document.querySelector("#color").style.opacity = 1;
        countdown();
    } else {
        document.querySelector("#color").style.opacity = 0;
        document.querySelector("#countdown").textContent = "3";
    }
}

function onPlayerReady(event) {
    event.target.setVolume(0);
    player.loadVideoById({'videoId': 'zmr2I8caF0c'});
    event.target.playVideo();

    // setInterval(function () {
    //     console.log('time', player.getCurrentTime())
    // }, 1000);
}

function countdown(){
    var item = document.querySelector("#countdown");

    var countdownInterval = setInterval(function () {
        if(restart === 0){
            restart = 3;
            clearInterval(countdownInterval);

            var video_id = dataFile[getRandomInt(0, (dataFile.length-1))].url.split('v=')[1];
            var ampersandPosition = video_id.indexOf('&');
            if(ampersandPosition != -1) {
                video_id = video_id.substring(0, ampersandPosition);
            }

            nextVid(video_id);

            return;
        }

        item.textContent = restart;
        restart--;
    }, 1000);
}

function nextVid(id){
    player.loadVideoById({'videoId': id});

    if(currentVid){
        currentVid.disabled = false;
    }

    document.querySelector("[data-video='"+id+"']").disabled = true;
    currentVid = document.querySelector("[data-video='"+id+"']");
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

window.addEventListener('load', initialize);
