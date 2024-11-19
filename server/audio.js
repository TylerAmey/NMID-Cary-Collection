// Use dynamic import() for ES modules
let Audic;
let isAudioInitialized = false; // Flag to check if audio is initialized

(async () => {
    // Dynamically import audic
    Audic = (await import('audic')).default;

    // Initialize the audio objects once Audic is available
    initAudio();
    isAudioInitialized = true;
})();

let crowdYell, crowdApplause, crowdBackground, crowdBoos, music, rlEndBow, rlEndWait, rlIntro, rlMiddleWalk, rlStepUp, rlUserBows, rlWalkedUpWithoutPose, rlReadyToWalk, fall;

function initAudio() {
    // Initialize the audio objects only once Audic is loaded
    crowdYell = new Audic('assets/sound/crowd effects/audience yelling.mp3');
    crowdApplause = new Audic('assets/sound/crowd effects/crowd applause.mp3');
    crowdBackground = new Audic('assets/sound/crowd effects/crowd bg noise.mp3');
    crowdBoos = new Audic('assets/sound/crowd effects/crowd boos.mp3');

    // music
    music = new Audic('assets/sound/music/circus music.mp3');
    music.loop = true; // Set looping for music

    // ringleader
    rlEndBow = new Audic('assets/sound/ringleader/EndBow.mp3');
    rlEndWait = new Audic('assets/sound/ringleader/EndWait.mp3');
    rlIntro = new Audic('assets/sound/ringleader/Intro.mp3');
    rlMiddleWalk = new Audic('assets/sound/ringleader/MiddleWalk.mp3');
    rlStepUp = new Audic('assets/sound/ringleader/StepUp.mp3');
    rlUserBows = new Audic('assets/sound/ringleader/UserBows.mp3');
    rlWalkedUpWithoutPose = new Audic('assets/sound/ringleader/WalkNoT.mp3');
    rlReadyToWalk = new Audic('assets/sound/ringleader/ReadyToWalk.mp3');

    // fall
    fall = new Audic('assets/sound/ringleader/Fall.mp3');
}

// Play audio function
const playAudio = (string) => {
    if (!isAudioInitialized) {
        console.log("Audio is not initialized yet.");
        return;
    }

    switch (string) {
        case 'Idle':
            if (!crowdBackground.playing) crowdBackground.play();
            break;
        case "Start":
            if (!crowdBackground.playing) crowdBackground.play();
            if (!rlIntro.playing) rlIntro.play();
            break;
        case "Stepup":
            if (!crowdBackground.playing) crowdBackground.play();
            rlStepUp.play();
            break;
        case "Walk":
            if (!crowdApplause.playing) crowdApplause.play();
            if (!rlReadyToWalk.playing) rlReadyToWalk.play();
            break;
        case "WalkNoTPose":
            if (!crowdBoos.playing) crowdBoos.play();
            if (!rlWalkedUpWithoutPose.playing) rlWalkedUpWithoutPose.play();
            break;
        case "MiddleSuccessful":
            if (!crowdApplause.playing) crowdApplause.play();
            if (!rlMiddleWalk.playing) rlMiddleWalk.play();
            break;
        case "EndBow":
            if (!crowdApplause.playing) crowdApplause.play();
            if (!rlEndBow.playing) rlEndBow.play();
            break;
        case "EndNoBow":
            if (!crowdBoos.playing) crowdBoos.play();
            break;
        case "EndWait":
            if (!crowdApplause.playing) crowdApplause.play();
            if (!rlEndWait.playing) rlEndWait.play();
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
    if (!isAudioInitialized) {
        console.log("Audio is not initialized yet.");
        return;
    }

    music.play();
}

// Reset all audio
const resetAudio = () => {
    if (!isAudioInitialized) {
        console.log("Audio is not initialized yet.");
        return;
    }

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

// Export functions
module.exports = {
    startUp,
    playAudio,
    resetAudio
};
