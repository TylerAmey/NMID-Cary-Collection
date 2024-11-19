var soundplayer = require("../index.js")

var options = {
    filename: "preview.mp3",
    gain: 100,
    debug: true,
    player: "mpg321", // "afplay" "aplay" "mpg123" "mpg321"
    device: "plughw:0,0"
}

var player = new soundplayer(options)
player.play();

player.on('complete', function() {
    console.log('Done with playback!');
});

player.on('error', function(err) {
    console.log('Error occurred:', err);
});
