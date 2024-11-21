

const Kinect2 = require("kinect2");

const kinect = new Kinect2();

//Current state of the program
let currentState;

//If the user hit the end platform, they can't trigger any prior events
let endStateStarted = false;

//If user started walking they can't go back
let walkStart = false;

//If out of idle
let gameStart = false;

//If End Bow state triggered
let gameEnd = false;

let timeOutNotStarted = true;

let stepupReady = false;


function startStepupTimeout(){
  timeOut
}

// I added a param, setState, to this function. This is is a function passed in
// form app.js that communicates with the server. Anytime setState is called, the
// server communicates to our webpage. 
// Therefor, any call of setState is passing a String to the server
// which can then do some stuff
function startKinect(setState) {

  // this is test code for the socket. it should be commented out
  // when we're ready to run

  // list of states recognized by index.js
  const states = [
    'Idle',
    'Start',
    'Stepup',
    'Walk',
    'WalkNoTPose',
    'MiddleSuccessful',
    'EndBow',
    'EndNoBow',
    'EndWait',
    'Fall',
  ];

  // this is the main thing that proves the socket works.
  // what this does is call setState, with a state - which is 
  // then sent to the server and recieved by index.js
  // when this occurs, what you'll find is that audio 
  // plays for each respective state. PROVING that there is a trigger
  // occuring.
 /*  const triggerStatesSequentially = () => {
    states.forEach((state, index) => {
      setTimeout(() => {
        setState(state);
      }, index * 1000); 
    });
  };

  // calls the above function after ten seconds
  setTimeout(() => {
    triggerStatesSequentially();
  }, 10000);
 */
  if (kinect.open()) {

    console.log("Kinect is open");

    setState('Idle');

    kinect.on("bodyFrame", (bodyFrame) => {
      //console.log("Body frame received:", bodyFrame);
      bodyFrame.bodies.forEach((body) => {
        if (body.tracked) {

          //console.log("Body is tracked");
          const joints = body.joints;

          // Check for T-pose gesture
          const leftHand = joints[Kinect2.JointType.handLeft];
          const rightHand = joints[Kinect2.JointType.handRight];
          const leftShoulder = joints[Kinect2.JointType.shoulderLeft];
          const rightShoulder = joints[Kinect2.JointType.shoulderRight];

          const head = joints[Kinect2.JointType.head];

          const isTpose =
            Math.abs(leftHand.cameraY - leftShoulder.cameraY) < 0.5 &&
            Math.abs(rightHand.cameraY - rightShoulder.cameraY) < 0.5 &&
            Math.abs(leftHand.cameraX - leftShoulder.cameraX) > 0.5 &&
            Math.abs(rightHand.cameraX - rightShoulder.cameraX) > 0.5;

          // Get the user's spineBase joint
          const spineBase = joints[Kinect2.JointType.spineBase];

          // Check if the user is within 3 feet (0.91 meters) from the center of the camera
          const withinCenter = Math.abs(spineBase.cameraX) <= 1.5;

          const feetInCenter = Math.abs(spineBase.cameraX) <= 0.25;

          // if(feetInCenter){
          //   console.log("center");
          // }
          // else if(withinCenter){
          //   console.log("within");
          // }

          // Calculate distance from Kinect (spine base Z coordinate)
          const distance = joints[Kinect2.JointType.spineBase].cameraZ;
          //console.log(`User distance: ${distance.toFixed(2)} meters`);
          if (withinCenter && !gameEnd) {
            gameStart = true;
            //console.log("T pose");
            //console.log("Im in center");
            if (!walkStart && distance <= 8) {
              currentState = "Start";
              setState('Start');
              if(timeOutNotStarted) {
                timeOutNotStarted = true;
                setTimeout(() => {
                  stepupReady = true;
                }, 7000);
              }
              // do something 
              if (distance <= 6.5 && stepupReady) {
                console.log(currentState + ' this should equal start');
                currentState = "StepUp";
                setState('StepUp');
              }
            }
            //Entering the tight rope
            //And add a condition to wait until the audio is done
            if (isTpose || endStateStarted) {
              walkStart = true;
              //Never hit
              // if(!endStateStarted && blah blah){
              //   currentState = "ReadyToWalk";
              // }
              if (distance <= 6 && distance >= 3.5 && feetInCenter && !endStateStarted) {
                currentState = "Walk";
                setState('Walk');
              }
              //Middle of tight rope
              else if (distance <= 3.5 && distance >= 1.4 && !endStateStarted) {
                currentState = "MiddleSuccess";
                setState('MiddleSuccess');
              }
              else if (distance <= 5.20 && !feetInCenter && !endStateStarted) {
                currentState = "Fall";
                setState('Fall');
              }
              //End of tight rope
              else {
                endStateStarted = true;
                //console.log(spineBase.cameraY);
                if (head.cameraY < 0.1) {
                  //console.log("Bow");
                  currentState = "EndBow";
                  setState('EndBow');
                  gameEnd = true;
                }
                else {
                  //console.log("End");
                  currentState = "EndWait";
                  setState('EndWait');
                }
              }
            }
            else if (!endStateStarted && walkStart) {
              //console.log("No T-Pose");
              if (distance <= 5.20 && feetInCenter && distance >= 1.4) {
                walkStart = true;
                currentState = "WalkNoT";
                setState('WalkNoT');
              }
              else if (distance <= 9.96 && distance >= 1.4) {
                currentState = "Fall";
                setState('Fall');
              }
            }
          }
          else if(!gameEnd && !gameStart){
            currentState = "Idle";
            setState('Idle');
          }

          console.log(currentState);
        }
      });
    });
    kinect.openBodyReader();
  } else {
    console.log("Kinect not connected!");
  }
}

module.exports = { startKinect };
