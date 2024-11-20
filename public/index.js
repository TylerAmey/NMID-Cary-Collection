const socket = io();

// crowd
const crowdYell = new Audio('assets/sound/crowd effects/audience yelling.mp3');
const crowdApplause = new Audio('assets/sound/crowd effects/crowd applause.mp3');
crowdApplause.volume = .3;
const crowdBackground = new Audio('assets/sound/crowd effects/crowd bg noise.mp3');
const crowdBoos = new Audio('assets/sound/crowd effects/crowd boos.mp3');
crowdBoos.volume = .3;

// music
const music = new Audio('/assets/sound/music/circus music.mp3');
music.loop = true;
music.volume = .3;

// ringleader
const rlEndBow = new Audio('assets/sound/ringleader/EndBow.mp3');
const rlEndWait = new Audio('assets/sound/ringleader/EndWait.mp3');
const rlIntro = new Audio('assets/sound/ringleader/Intro.mp3');
const rlMiddleWalk = new Audio('assets/sound/ringleader/MiddleWalk.mp3');
const rlStepUp = new Audio('assets/sound/ringleader/StepUp.mp3');
const rlUserBows = new Audio('assets/sound/ringleader/UserBows.mp3');
const rlWalkedUpWithoutPose = new Audio('assets/sound/ringleader/WalkNoT.mp3');
const rlReadyToWalk = new Audio('assets/sound/ringleader/ReadyToWalk.mp3');

// fall
const fall = new Audio('assets/sound/ringleader/Fall.mp3');
// bool for if audio is already playing
const audioPlaying = false;

// state variables
let idleTriggered = false;
let startTriggered = false;
let stepupTriggered = false;
let walkTriggered = false;
let walkNoTPoseTriggered = false;
let middleSuccessfulTriggered = false;
let endBowTriggered = false;
let endNoBowTriggered = false;
let endWaitTriggered = false;
let fallTriggered = false;

// function for handling audio based off of state
// plays proper soundbytes with included logic for not overlapping
// Ringleader audio and not playing two crowd audios at once
const playAudio = (state) => {
    switch (state) {
        case 'Idle':

        // check if state isn't triggered yet
            if (!idleTriggered) {

                // then, check if the audio we want to play isn't already playing.
                // this is mostly for the crowd so it doesn't overlap/sound janky
                if (crowdBackground.paused) {

                    // call resetAudio to pause everything.
                    resetAudio();

                    // then play the sound byte we want
                    crowdBackground.play();
                }

                // set the state to be true so we don't retrigger the state
                idleTriggered = true;
            }

            // break
            break;

        // other cases simlar to above but also include logic for 
        // ringleader audio
        case "Start":
            if (!startTriggered) {
                if (crowdBackground.paused) {
                    resetAudio();
                    crowdBackground.play();
                }
                if (rlIntro.paused) {
                    stopRingleader();
                    rlIntro.play();
                }
                startTriggered = true;
            }
            break;

        case "Stepup":
            if (!stepupTriggered) {
                if (crowdBackground.paused) {
                    resetAudio();
                    crowdBackground.play();
                }
                if (rlStepUp.paused) {
                    stopRingleader();
                    rlStepUp.play();
                }
                stepupTriggered = true;
            }
            break;

        case "Walk":
            if (!walkTriggered) {
                if (crowdApplause.paused) {
                    resetAudio();
                    crowdApplause.play();
                }
                if (rlReadyToWalk.paused) {
                    stopRingleader();
                    rlReadyToWalk.play();
                }
                walkTriggered = true;
            }
            break;

        case "WalkNoTPose":
            if (!walkNoTPoseTriggered) {
                if (crowdBoos.paused) {
                    resetAudio();
                    crowdBoos.play();
                }
                if (rlWalkedUpWithoutPose.paused) {
                    stopRingleader();
                    rlWalkedUpWithoutPose.play();
                }
                walkNoTPoseTriggered = true;
            }
            break;

        case "MiddleSuccessful":
            if (!middleSuccessfulTriggered) {
                if (crowdApplause.paused) {
                    resetAudio();
                    crowdApplause.play();
                }
                if (rlMiddleWalk.paused) {
                    stopRingleader();
                    rlMiddleWalk.play();
                }
                middleSuccessfulTriggered = true;
            }
            break;

        case "EndBow":
            if (!endBowTriggered) {
                if (crowdApplause.paused) {
                    resetAudio();
                    crowdApplause.play();
                }
                if (rlEndBow.paused) {
                    stopRingleader();
                    rlEndBow.play();
                }
                endBowTriggered = true;
            }
            break;

        case "EndNoBow":
            if (!endNoBowTriggered) {
                if (crowdBoos.paused) {
                    resetAudio();
                    crowdBoos.play();
                }
                endNoBowTriggered = true;
            }
            break;

        case "EndWait":
            if (!endWaitTriggered) {
                if (crowdApplause.paused) {
                    resetAudio();
                    crowdApplause.play();
                }
                if (rlEndWait.paused) {
                    stopRingleader();
                    rlEndWait.play();
                }
                endWaitTriggered = true;
            }
            break;

        case "Fall":
            if (!fallTriggered) {
                resetAudio();
                crowdBoos.currentTime = 0;
                if (crowdBoos.paused) {
                    crowdBoos.play();
                }
                if (fall.paused) {
                    stopRingleader();
                    fall.play();
                }
                fallTriggered = true;
            }
            break;

        default:
            console.log("No matching audio for the provided string.");
            break;
    }
};


const startUp = () => {
    music.play();
}

// chatgpt wrote these because I was lazy
const resetAudio = () => {
    // List of all audio objects to reset
    const audios = [
        crowdYell, crowdApplause, crowdBackground, crowdBoos,
        rlEndBow, rlEndWait, rlIntro, rlMiddleWalk, rlStepUp,
        rlUserBows, rlWalkedUpWithoutPose, rlReadyToWalk, fall
    ];

    // Loop through each audio object and reset its position
    audios.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });

    // note we also call startUp.
    startUp();
}

// stop ringleader audio only. useful to prevent overlap.
const stopRingleader = () => {

    const audios = [rlEndBow, rlEndWait, rlIntro, rlMiddleWalk, rlStepUp,
        rlUserBows, rlWalkedUpWithoutPose, rlReadyToWalk, fall];

    audios.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
}

// Reset function to clear all states
const resetStates = () => {
    idleTriggered = false;
    startTriggered = false;
    stepupTriggered = false;
    walkTriggered = false;
    walkNoTPoseTriggered = false;
    middleSuccessfulTriggered = false;
    endBowTriggered = false;
    endNoBowTriggered = false;
    endWaitTriggered = false;
    fallTriggered = false;
};

// end of chatGPT written functions I was too lazy to do myself
// - andrew

const endBowA = document.createElement('video');
endBowA.src = 'assets/video/EndBowAudience.mp4';
endBowA.loop = false;

const excitedA = document.createElement('video');
excitedA.src = 'assets/video/ExcitedAudience.mp4';
excitedA.loop = false;

const readyToWalkA = document.createElement('video');
readyToWalkA.src = 'assets/video/ReadyToWalkAudience.mp4';
readyToWalkA.loop = false;

const startA = document.createElement('video');
startA.src = 'assets/video/StartAudience.mp4';
startA.loop = false;

const stepUpA = document.createElement('video');
stepUpA.src = 'assets/video/StepUpAudience.mp4';
stepUpA.loop = false;

const walkNoTA = document.createElement('video');
walkNoTA.src = 'assets/video/WalkNoTAudience.mp4';
walkNoTA.loop = false;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { alpha: false });
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';

const drawVideoToCanvas = () => {
    if (!excitedA.paused && !excitedA.ended) {
        ctx.drawImage(excitedA, 0, 0, canvas.width, canvas.height);
        requestAnimationFrame(drawVideoToCanvas);
    }
};

excitedA.addEventListener('play', () => {
    drawVideoToCanvas();
});

excitedA.addEventListener('loadedmetadata', () => {
    canvas.width = excitedA.videoWidth;
    canvas.height = excitedA.videoHeight;
});

document.getElementById('restart').addEventListener('click', () => {
    resetAudio();
    resetStates();
    console.log('reset stuff');
});


// this is where we want to manage the states.
// essentially, the socket grabs any emited information.
// we KNOW it's a String because I programmed it that way in app.js
// using that, we can call our states from there.
socket.on('state', state => {

    // test log
    console.log(state);

    // startUp called here to play music - but not necessary
    if (music.paused) {
        startUp();

    // call a state
    } else {
        playAudio(state);
    }
})

window.onload = () => {
    excitedA.play();
};