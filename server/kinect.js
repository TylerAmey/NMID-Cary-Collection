//const audioFunctions = require('./audio.js');
//const animateFunctions =require('./animate.js');

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

function getState(){
  return currentState;
}

function startKinect(setState) {

  setTimeout(() => {
    setState('test string');
  }, 10000);

  if (kinect.open()) {
  
    console.log("Kinect is open");

    //audioFunctions.startUp();
    //animateFunctions.startUp();

    kinect.on("bodyFrame", (bodyFrame) => {
      //console.log("Body frame received:", bodyFrame);
      bodyFrame.bodies.forEach((body) => {
        if (body.tracked) {

          

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

          const feetInCenter =  Math.abs(spineBase.cameraX) <= 0.25;

          // if(feetInCenter){
          //   console.log("center");
          // }
          // else if(withinCenter){
          //   console.log("within");
          // }

          // Calculate distance from Kinect (spine base Z coordinate)
          const distance = joints[Kinect2.JointType.spineBase].cameraZ;
          //console.log(`User distance: ${distance.toFixed(2)} meters`);
          if(withinCenter && !gameEnd){
            gameStart = true;
            //console.log("T pose");
            if(!walkStart){
              currentState = "Start";
              setState('Start')
              // do something 
              if (distance <= 10.72) {
                currentState = "StepUp";
              } 
            }
            //Entering the tight rope
            //And add a condition to wait until the audio is done
            if(isTpose){
              walkStart = true;
              //Never hit
              // if(!endStateStarted && blah blah){
              //   currentState = "ReadyToWalk";
              // }
              if (distance <= 4.98 &&  distance >= 3.19 && feetInCenter && !endStateStarted){
                currentState = "Walk";
                //audioFunctions.playAudio('Walk');
              } 
              //Middle of tight rope
              else if (distance <= 3.19 && distance >= 1.3 && !endStateStarted) {
                currentState = "MiddleSuccess";
                //audioFunctions.playAudio('MiddleSuccesful');
              } 
              else if (distance <= 4.98 && !feetInCenter && !endStateStarted){
                currentState = "Fall";
                //audioFunctions.playAudio('Fall');
              }
              //End of tight rope
              else{
                endStateStarted = true;
                if(head.cameraY < 0.1){
                  //console.log("Bow");
                  currentState = "EndBow";
                  gameEnd = true;
                }
                else{
                  //console.log("End");
                  currentState = "EndWait";
                }
              }
            }
            else if (!endStateStarted && walkStart){
              //console.log("No T-Pose");
              if(distance <= 4.98 && feetInCenter && distance >= 2.38){
                walkStart = true;
                currentState = "WalkNoT";
              }
              else if (distance <= 9.96 && distance >= 2.38)
              {
                currentState = "Fall";
              }
            }
          }
          else if (!gameStart){
            currentState = "Idle";
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

function isHeadBelowShoulders(joints) {
  const head = joints[Kinect2.JointType.head];
  const shoulderCenter = joints[Kinect2.JointType.spineShoulder]; // Central shoulder joint

  // Check if the head is below the shoulders
  return head.cameraY <= shoulderCenter.cameraY;
}


module.exports = { startKinect };
