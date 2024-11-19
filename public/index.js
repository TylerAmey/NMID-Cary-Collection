const socket = io();

// crowd
const crowdYell = new Audio('assets/sound/crowd effects/audience yelling.mp3');
const crowdApplause = new Audio('assets/sound/crowd effects/crowd applause.mp3');
const crowdBackground = new Audio('assets/sound/crowd effects/crowd bg noise.mp3');
const crowdBoos = new Audio('assets/sound/crowd effects/crowd boos.mp3');

// music
const music = new Audio('/assets/sound/music/circus music.mp3');
music.loop = true;

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




const playAudio = (string) => {
    switch (string) {
        case 'Idle':
            if (crowdBackground.paused) crowdBackground.play();
            break;
        case "Start":
            if (crowdBackground.paused) crowdBackground.play();
            if (rlIntro.paused) rlIntro.play();
            break;
        case "Stepup":
            if (crowdBackground.paused) crowdBackground.play();
            rlStepUp.play();
            break;
        case "Walk":
            if (crowdApplause.paused) crowdApplause.play();
            if (rlReadyToWalk.paused) rlReadyToWalk.play();
            break;
        case "WalkNoTPose":
            if (crowdBoos.paused) crowdBoos.play();
            if (rlWalkedUpWithoutPose.paused) rlWalkedUpWithoutPose.play();
            break;
        case "MiddleSuccessful":
            if (crowdApplause.paused) crowdApplause.play();
            if (rlMiddleWalk.paused) rlMiddleWalk.play();
            break;
        case "EndBow":
            if (crowdApplause.paused) crowdApplause.play();
            if (rlEndBow.paused) rlEndBow.play();
            break;
        case "EndNoBow":
            if (crowdBoos.paused) crowdBoos.play();
            break;
        case "EndWait":
            if (crowdApplause.paused) crowdApplause.play();
            if (rlEndWait.paused) rlEndWait.play();
            break;
        case "Fall":
            crowdBoos.currentTime = 0;
            if (crowdBoos.paused) crowdBoos.play();
            if (fall.paused) fall.play();
            break;
        default:
            console.log("No matching audio for the provided string.");
            break;
    }
}
const startUp = () => {
    music.play();
}

// chatgpt wrote this rofl
const resetAudio = () => {
    // List of all audio objects to reset
    const audios = [
        crowdYell, crowdApplause, crowdBackground, crowdBoos,
        music, rlEndBow, rlEndWait, rlIntro, rlMiddleWalk, rlStepUp,
        rlUserBows, rlWalkedUpWithoutPose, rlReadyToWalk, fall
    ];

    // Loop through each audio object and reset its position
    audios.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });

    startUp();
}

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

document.getElementById('startButton').addEventListener('click', startUp);
document.getElementById('stepUp').addEventListener('click', () => {
    playAudio('Stepup');
});

let counter = 0;

// this is where we want to manage the states
socket.on('state', state => {

    console.log(state);
    counter++;

    /* if(counter == 1){
        playAudio('Idle');
    } */
   startUp();
})

// <script src="/socket.io/socket.io.js"></script>
// <script src="index.js"></script>

window.onload = () => {
    excitedA.play();
};