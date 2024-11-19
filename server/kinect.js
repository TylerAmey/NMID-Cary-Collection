const Kinect2 = require("kinect2");

const kinect = new Kinect2();

let currentState;
//let tPoseSuccess = true;

//If the user hit the end platform, they can't trigger any prior events
let endStateStarted = false;

let walkStart = false;

function startKinect() {
  if (kinect.open()) {
  
    console.log("Kinect is open");

    kinect.on("bodyFrame", (bodyFrame) => {

      //console.log("Body frame received:", bodyFrame);
      bodyFrame.bodies.forEach((body) => {

        if (body.tracked) {
          const joints = body.joints;

          // Get the user's foot joints
          const footLeft = joints[Kinect2.JointType.footLeft];
          const footRight = joints[Kinect2.JointType.footRight];

          // Check if both feet are within the center of the camera
          const feetInCenter =
            Math.abs(footLeft.cameraX) <= 0.91 &&
            Math.abs(footLeft.cameraY) <= 0.91 &&
            Math.abs(footRight.cameraX) <= 0.91 &&
            Math.abs(footRight.cameraY) <= 0.91;

            // Check for T-pose gesture
          const leftHand = joints[Kinect2.JointType.handLeft];
          const rightHand = joints[Kinect2.JointType.handRight];
          const leftShoulder = joints[Kinect2.JointType.shoulderLeft];
          const rightShoulder = joints[Kinect2.JointType.shoulderRight];

          const isTpose =
            Math.abs(leftHand.cameraY - leftShoulder.cameraY) < 0.2 &&
            Math.abs(rightHand.cameraY - rightShoulder.cameraY) < 0.2 &&
            Math.abs(leftHand.cameraX - leftShoulder.cameraX) > 0.5 &&
            Math.abs(rightHand.cameraX - rightShoulder.cameraX) > 0.5;

          // Get the user's spineBase joint
          const spineBase = joints[Kinect2.JointType.spineBase];

          // Check if the user is within 3 feet (0.91 meters) from the center of the camera
          const withinCenter = Math.abs(spineBase.cameraX) <= 0.91 && Math.abs(spineBase.cameraY) <= 0.91;

          // Calculate distance from Kinect (spine base Z coordinate)
          const distance = joints[Kinect2.JointType.spineBase].cameraZ;
          //console.log(`User distance: ${distance.toFixed(2)} meters`);
          if(withinCenter){
            //console.log("T pose");
            if(!walkStart){
              currentState = "Start";
              if (distance <= 4.5) {
                currentState = "StepUp";
              } 
            }
            //Entering the tight rope
            //And add a condition to wait until the audio is done
            if(isTpose && !endStateStarted){
              currentState = "ReadyToWalk";
              if (distance <= 4.2 && feetInCenter){
                walkStart = true;
                currentState = "Walk";
              } 
              //Middle of tight rope
              else if (distance <= 2.8 && feetInCenter) {
                currentState = "MiddleSuccess";
              } 
              else if (distance <= 4.2 && !feetInCenter){
                currentState = "Fall";
              }
            }
            else if (distance <= 1.4) {
              endStateStarted = true;
              if(isUserBowing(joints)){
                console.log("Bow");
                currentState = "EndBow";
              }
              //else if (!isUserBowing(joints)){
                //currentState = "EndNoBow";
              //}
              else{
                currentState = "EndWait";
              }
            }
            else if (!endStateStarted){
                //console.log("No T-Pose");
                if(distance <= 4.2 && feetInCenter && distance >= 1.4){
                  walkStart = true;
                  currentState = "WalkNoT";
                }
                else{
                  currentState = "Fall";
                }
            }
          }
          else{
            currentState = "Idle";
          }
        }
      });

      //Canvas and audio handling
      

    });
    kinect.openBodyReader();
  } else {
    console.log("Kinect not connected!");
  }
}

function isUserBowing(joints) {
  // Get relevant joints
  const head = joints[Kinect2.JointType.head];
  const spineMid = joints[Kinect2.JointType.spineMid];
  const spineBase = joints[Kinect2.JointType.spineBase];

  // Calculate the height difference between head and spineMid
  const headToSpineMid = head.cameraY - spineMid.cameraY;

  // Calculate the forward bend angle (difference in z-axis)
  const spineBend = spineMid.cameraZ - spineBase.cameraZ;

  // Thresholds
  const headBendThreshold = -0.2; // Head moves below spineMid
  const spineBendThreshold = 0.15; // SpineMid moves forward compared to SpineBase

  // Determine if the user is bowing
  return (
    headToSpineMid < headBendThreshold &&
    spineBend > spineBendThreshold &&
    handsNearBody
  );
}


module.exports = { startKinect };
