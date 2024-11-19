// crowd
const crowdYell = new Audio('assets/sound/crowd effects/audience yelling.mp3');
const crowdApplause = new Audio('assets/sound/crowd effects/crowd applause.mp3');
const crowdBackground = new Audio('assets/sound/crowd effects/crowd bg noise.mp3');
const crowdBoos = new Audio('assets/sound/crowd effects/crowd boos.mp3');

// music
const music = new Audio('assets/sound/music/circus music.mp3');
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

const receiveData = (string) => {
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
            if(crowdBoos.paused) crowdBoos.play();
            if(fall.paused) fall.play();
            break;
        default:
            console.log("No matching audio for the provided string.");
            break;
    }
}
const startUp = () => {
    music.play();
}