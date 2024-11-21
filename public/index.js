/* Authors: Andrew Black, Blessing
 * Since: 11/18/24
 * Purpose: index.js is the main script to be used with our index.html page
 * it utilizes socket.io to communicate with kinect.js to get information about
 * the state of things, which it then uses to play audio and video.
 * Note that we also believe that the file structure is a bit obtuse - 
 * We would also much prefer it if much of the functionality was imported in.
 * We're just running with this spaghetti due to time.
 */

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

// video elements for canvas
const endBowA = document.createElement('video');
endBowA.src = 'assets/video/EndBowAudience.mp4';
endBowA.loop = false;

const excitedA = document.createElement('video');
excitedA.src = 'assets/video/ExcitedAudience.mp4';
excitedA.loop = true;

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

const idleA = document.createElement('video');
idleA.src = 'assets/video/IdleAudience.mp4';
idleA.loop = true;

const fallA = document.createElement('video');
fallA.src = 'assets/video/FallingAudience.mp4';
fallA.loop = false;

readyToWalkA.addEventListener('ended', () => {
    playCanvasVideo(excitedA);
});

startA.addEventListener('ended', () => {
    playCanvasVideo(idleA);
});

// var for current video
let currentVideo = null;

// canvas setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { alpha: false });
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';

// function is responsible for adjusting the size of the canvas
// to match that of the video. The reason for this is because otherwise
// the canvas loads in videos in garbage quality.
const adjustCanvasDimensions = (video) => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    console.log(`Canvas dimensions set to ${canvas.width}x${canvas.height}`);
};

// function responsible for actually 'drawing' to the canvas
const drawVideoToCanvas = (video) => {
    if (!video.paused && !video.ended) {

        // update the canvas dimensions first, then draw
        adjustCanvasDimensions(video);

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        requestAnimationFrame(() => drawVideoToCanvas(video));
    }
};

// calling this plays a video
const playCanvasVideo = (video) => {

    // first, ensure the video we want to play isn't the currently playing video
    if (currentVideo !== video) {

        // reset the currentvideo for next time
        if (currentVideo && !currentVideo.paused) {
            currentVideo.pause();
            currentVideo.currentTime = 0;
        }

        // update current video
        currentVideo = video;

        // the next two, ill be honest, chatgpt helped me out with.
        // i have no idea if both are necessary but im not willing to find out
        // play the video when the data is loaded in
        video.onloadeddata = () => {
            video.play();
            drawVideoToCanvas(video);
        };

        // Handle edge cases for videos that are already loaded
        if (video.readyState >= 3) { // '3' means the video is ready
            video.play();
            drawVideoToCanvas(video);
        }
    }
};

// function for handling audio and video based off of state
// plays proper soundbytes and mp4 with included logic for not overlapping video or
// Ringleader audio and not playing two crowd audios at once
const playAudioAndVideo = (state) => {
    switch (state) {
        case 'Idle':

            // check if state isn't triggered yet
            if (!idleTriggered) {

                // then, check if the audio we want to play isn't already playing
                // and that the video we want to play isn't already playing
                // this is mostly for the crowd so it doesn't overlap/sound janky
                if (crowdBackground.paused) {

                    // call resetAudio to pause everything.
                    resetAudio();

                    // then play the sound byte we want
                    crowdBackground.play();

                }
                if (currentVideo !== idleA) {

                    // playCanvasVideo already has logic for resetting
                    // stuff
                    playCanvasVideo(idleA);
                }

                // set the triggered state to true so it can't be recalled
                idleTriggered = true;
            }
            break;

        // most cases are like 'Start', with the only difference being
        // worrying about the ringleader audio which is handled near
        // identical to the crowd audio
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
                if (currentVideo !== startA) {
                    playCanvasVideo(startA);
                }
                startTriggered = true;
            }
            break;

        case "StepUp":
            if (!stepupTriggered) {
                if (crowdBackground.paused) {
                    resetAudio();
                    crowdBackground.play();
                }
                if (rlStepUp.paused) {
                    stopRingleader();
                    rlStepUp.play();
                }
                if (currentVideo !== idleA) {
                    playCanvasVideo(idleA);
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
                if (currentVideo !== readyToWalkA) {
                    playCanvasVideo(readyToWalkA);
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
                if (currentVideo !== walkNoTA) {
                    playCanvasVideo(walkNoTA);
                }
                walkNoTPoseTriggered = true;
            }
            break;

        case "MiddleSuccess":
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
                if (currentVideo !== endBowA) {
                    playCanvasVideo(endBowA);
                }

                setTimeout(() => {
                    stopAudio();
                }, 4000);
                
                endBowTriggered = true;
            }
            break;

        case "EndNoBow":
            if (!endNoBowTriggered) {
                if (crowdBoos.paused) {
                    resetAudio();
                    crowdBoos.play();
                }
                if (currentVideo !== endBowA) {
                    playCanvasVideo(endBowA);
                }

                endNoBowTriggered = true;
                setTimeout(() => {
                    stopAudio();
                }, 5000);
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

                if(currentVideo != fallA){
                    playCanvasVideo(fallA);
                }
                fallTriggered = true;

                setTimeout(() => {
                    stopAudio();
                }, 14000);
            }
            break;

        default:
            console.log("No matching audio/video for the provided state.");
            break;
    }
};

// Array of all audio objects for next two functions
const audios = [
    crowdYell, crowdApplause, crowdBackground, crowdBoos,
    rlEndBow, rlEndWait, rlIntro, rlMiddleWalk, rlStepUp,
    rlUserBows, rlWalkedUpWithoutPose, rlReadyToWalk, fall
];

// variable is used when trying to play the main music
// in our socket.on function. In short, this is only set
// true in the next function, stopAudio, which is only called 
// when the program should be finished
let audioStopped = false;

// stop the audio, entirely.
const stopAudio = () => {

    // Loop through each audio object and reset its position
    audios.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });

    audioStopped = true;

}

// chatgpt wrote these because I was lazy-
// reset all audio back to their start time.
const resetAudio = () => {

    // Loop through each audio object and reset its position
    audios.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });

    // note we also call startUp. this is incase we shut off the main music,
    // although it's possible that it's unecessary to call
    startUp();
};

// stop ringleader audio only. useful to prevent overlap.
const stopRingleader = () => {
    const audios = [rlEndBow, rlEndWait, rlIntro, rlMiddleWalk, rlStepUp,
        rlUserBows, rlWalkedUpWithoutPose, rlReadyToWalk, fall];

    audios.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
};

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

// this is where we want to manage the states.
// essentially, the socket grabs any emited information.
// we KNOW it's a String because I programmed it that way in app.js
// using that, we can call our states from there.
socket.on('state', state => {
    // test log
    console.log(state);

    // call startup function, getting the music to play
    if (music.paused && !audioStopped) startUp();

    // call a state
    playAudioAndVideo(state);
});

// startup plays the main music
const startUp = () => {
    music.play();
}

// Initialize the music (if not already playing)
window.onload = () => {

    console.log('onload');
};



