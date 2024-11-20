/*
Play two sound files 3 seconds apart in a continuous loop.
Uses the setOptions method to update the filename each time.
 */

var soundplayer = require("../index.js")

var options = {
    filename: "preview.mp3",
    gain: 10,
    debug: false,
    player: 'ffplay'
}

var player = new soundplayer(options)
player.play();

player.on('complete', function() {
    console.log('Done playing ', options.filename);
    console.log('Playing next file in 3 seconds');

    setTimeout(function() {
        options.filename = options.filename == "preview.mp3" ? "preview.wav" : "preview.mp3";
        //player.setOptions();
        player.play(options);
    }, 3000)

});

player.on('error', function(err) {
    console.log('Error occurred:', err);
});
