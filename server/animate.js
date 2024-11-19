// Video elements
const endBowA = document.createElement('video');
endBowA.src = 'assets/video/EndBowAudience.mp4';
endBowA.loop = false;

const excitedA = document.createElement('video');
excitedA.src = 'assets/video/ExcitedAudience.mp4';
excitedA.loop = false;

const fallingA = document.createElement('video');
fallingA.src = 'assets/video/FallingAudience.mp4';
fallingA.loop = false;

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

// function to play a video
const playVideo = (videoElement) => {
    videoElement.currentTime = 0; // Start from the beginning
    videoElement.play();
};

// Video control logic
const receiveData = (string) => {
    switch (string) {
        case 'Idle':
            playVideo(startA)
            break;
        case "Start":
            playVideo(startA);
            break;
        case "Stepup":
            playVideo(stepUpA);
            break;
        case "Walk":
            playVideo(excitedA);
            playVideo(readyToWalkA);
            break;
        case "WalkNoTPose":
            playVideo(walkNoTA);
            break;
        case "MiddleSuccessful":
            playVideo(excitedA);
            break;
        case "EndBow":
            playVideo(excitedA);
            playVideo(endBowA);
            break;
        case "EndNoBow":
            playVideo(endBowA);
            break;
        case "EndWait":
            playVideo(excitedA);
            break;
        case "Fall":
            playVideo(fallingA);
            break;
        default:
            playVideo(walkNoTA);
            break;
    }
};


const startUp = () => {
    console.log("Starting up...");
    playVideo(startA)
};
