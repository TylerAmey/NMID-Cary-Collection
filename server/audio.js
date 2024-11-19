const Player = require('sound-player');

// crowd
const crowdYell = new Player({filename: '/assets/sound/crowd effects/audience yelling.mp3'});
const crowdApplause = new Player({filename: 'assets/sound/crowd effects/crowd applause.mp3'});
const crowdBackground = new Player({filename: 'assets/sound/crowd effects/crowd bg noise.mp3'});
const crowdBoos = new Player({filename: 'assets/sound/crowd effects/crowd boos.mp3'});

// music
const music = new Player({filename: 'assets/sound/music/circus music.mp3'});
music.loop = true;  // sound-player handles looping natively

// ringleader
const rlEndBow = new Player({filename: 'assets/sound/ringleader/EndBow.mp3'});
const rlEndWait = new Player({filename: 'assets/sound/ringleader/EndWait.mp3'});
const rlIntro = new Player({filename: 'assets/sound/ringleader/Intro.mp3'});
const rlMiddleWalk = new Player({filename: 'assets/sound/ringleader/MiddleWalk.mp3'});
const rlStepUp = new Player({filename: 'assets/sound/ringleader/StepUp.mp3'});
const rlUserBows = new Player({filename: 'assets/sound/ringleader/UserBows.mp3'});
const rlWalkedUpWithoutPose = new Player({filename: 'assets/sound/ringleader/WalkNoT.mp3'});
const rlReadyToWalk = new Player({filename: 'assets/sound/ringleader/ReadyToWalk.mp3'});

// fall
const fall = new Player({filename: 'assets/sound/ringleader/Fall.mp3'});

// Play audio function
const playAudio = (string) => {
    switch (string) {
        case 'Idle':
            if (!crowdBackground.isPlaying) crowdBackground.play();
            break;
        case "Start":
            if (!crowdBackground.isPlaying) crowdBackground.play();
            if (!rlIntro.isPlaying) rlIntro.play();
            break;
        case "Stepup":
            if (!crowdBackground.isPlaying) crowdBackground.play();
            rlStepUp.play();
            break;
        case "Walk":
            if (!crowdApplause.isPlaying) crowdApplause.play();
            if (!rlReadyToWalk.isPlaying) rlReadyToWalk.play();
            break;
        case "WalkNoTPose":
            if (!crowdBoos.isPlaying) crowdBoos.play();
            if (!rlWalkedUpWithoutPose.isPlaying) rlWalkedUpWithoutPose.play();
            break;
        case "MiddleSuccessful":
            if (!crowdApplause.isPlaying) crowdApplause.play();
            if (!rlMiddleWalk.isPlaying) rlMiddleWalk.play();
            break;
        case "EndBow":
            if (!crowdApplause.isPlaying) crowdApplause.play();
            if (!rlEndBow.isPlaying) rlEndBow.play();
            break;
        case "EndNoBow":
            if (!crowdBoos.isPlaying) crowdBoos.play();
            break;
        case "EndWait":
            if (!crowdApplause.isPlaying) crowdApplause.play();
            if (!rlEndWait.isPlaying) rlEndWait.play();
            break;
        case "Fall":
            crowdBoos.stop(); // Stop any currently playing boos before starting new one
            crowdBoos.play();
            fall.play();
            break;
        default:
            console.log("No matching audio for the provided string.");
            break;
    }
}

// Start Up music
const startUp = () => {
    music.play();
}

// Reset all audio
const resetAudio = () => {
    // List of all audio objects to reset
    const audios = [
        crowdYell, crowdApplause, crowdBackground, crowdBoos,
        music, rlEndBow, rlEndWait, rlIntro, rlMiddleWalk, rlStepUp,
        rlUserBows, rlWalkedUpWithoutPose, rlReadyToWalk, fall
    ];

    // Loop through each audio object and stop it
    audios.forEach(audio => {
        audio.stop();
    });

    // Start the music again
    startUp();
}

module.exports = {
    startUp,
    playAudio,
    resetAudio
};
