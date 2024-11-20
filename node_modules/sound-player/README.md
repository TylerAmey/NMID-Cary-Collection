Sound Player
===========

Supports the following sound players
- `AFPLAY`(mac)
- `FFPLAY`
- `APLAY`,
- `MPG321`,
- `MPG123`)

Nodejs soundplayer wrapper for several command line sound players (above). It is important to note that each of these players need to be installed before they can be used by the lib.
> Tip: Use 'aplay' to play '.wav' audio files, 'mpg321' and 'mpg123' for playing 'mp3' files.

This library also attempts to provide additional support for parameters such as specifying `audio device` and `gain` (volume). These are specified using the `options` parameter.


```javascript
// All options
var options = {
    filename: "preview.mp3",
    gain: 100,
    debug: true,
    player: "afplay",   // other supported players are 'aplay', 'mpg123', 'mpg321'
    device: "plughw0:0"
}

// instantiation with options
var soundplayer = require("sound-player")
var player = new soundplayer(options)
player.play() ;

// instantiation with only filepath
var soundplayer = require("sound-player")
var player = new soundplayer("path/to/file.mpg")
player.play() ;
```

```javascript
// Update player options *after* instantiating library
options.player = 'mpg321' ;
options.filename = 'newfile.mp3'
player.play(options) ;

```


See the tests folder for more samples.


> Note: On a mac, 'afplay' is selected by default if no player parameter is provided. `aplay` is selected by default on other OS types.


## Installation
-----------

Great idea to update your OS

```
sudo apt-get update
sudo apt-get upgrade
```

### Debian/Ubuntu - MPG123 ###
````
sudo apt-get install mpg123
npm install sound-player
````

### Debian/Ubuntu - MPG321 ###
````
sudo apt-get install mpg321
npm install sound-player
````

### Debian/Ubuntu - APLAY ###
````
sudo apt-get install alsa-base alsa-utils
npm install sound-player
````

Example Usage
------------

````javascript
// With full options
var soundplayer = require("sound-player");
var options = {
    filename: "preview.mp3",
    gain: 100,
    debug: true,
    player: "aplay", // "afplay" "aplay" "mpg123" "mpg321"
    device: "plughw:0,0"   //
}

var player = new soundplayer(options)
player.play();

player.on('complete', function() {
    console.log('Done with playback!');
});

player.on('error', function(err) {
    console.log('Error occurred:', err);
});

````

What is my audio device id?
------------
You can check your audio device using the following command (you need aplay installed.)
```
aplay -L
```
