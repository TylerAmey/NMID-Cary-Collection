const Kinect2 = require("kinect2");

const kinect = new Kinect2();

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
          console.log(`User distance: ${distance.toFixed(2)} meters`);
          if(withinCenter){
            console.log("Start");
            //console.log("Within play area");
            //Ring leader: Step right up
            //Entering the start platform
            //No need for feet to be in the center of the platform
            if (distance <= 4.5) {
              console.log("StepUp");
              //console.log("Player active");
              //State: Active
              //Ring leader: Spot light's on you! Prompt to raise arms
              //Visual Assets: Some audience members look up
              //Sound: General crowd noise
            } 
            //Entering the tight rope
            //And add a condition to wait until the audio is done
            if(isTpose){
              console.log("ReadyToWalk");
              //State: Walk State
              //Ring leader: Start walking. Let the show begin
              //Visual Assets: Tightrope appears
              //Sound: Audience cheers
              //console.log("T Pose");
              if (distance <= 4.2 && feetInCenter){
                console.log("Walk");
                //console.log("Feet in center");
                //console.log("Walking on tightrope");
                //State: Walk State
                //Visual Assets: Tightrope appears
                //Sound: Audience cheers
              } 
              //Middle of tight rope
              else if (distance <= 2.8 && feetInCenter) {
                console.log("MiddleSuccess");
                //let inPoseState = true;
                //State: Middle state
                //Ring leader: Good job!
                //Visual Assets: Screen change
                //Sound: ???
              } 
              else if (distance <= 4.2 && !feetInCenter){
                console.log("Fall");
              }
            }
            else if (distance <= 1.4) {
              if(isUserBowing(joints)){
                console.log("EndBow");
                //console.log("Bowing");
                //State: End State Bow
                //Visual Assets: Same as above?
                //Sound: Cheering
              }
              //Add 3 second timer for if they don't bow with an "and" condition
              else if (!isUserBowing(joints)){
                console.log("EndNoBow");
                //State: End State Bow
                //Visual Assets: Crowd calming down
                //Sound: Murmur
              }
              else{
                console.log("EndWait");
                //console.log("End of tightrope");
                //State: End State Off Tightrope
                //Visual Assets: Crowd cheer/excited
                //Sound: Cheering
                //Ring leader: "Take a bow"
              }
            }
            else{
                console.log("No T-Pose");
                //State: No T-Pose
                //Visual Assets: ???
                //Sound: Ring leader asking
                if(distance <= 4.2 && feetInCenter && distance >= 1.4){
                  console.log("WalkNoT");
                  //console.log("No T-Pose and too far");
                  //State: No T-Pose and too far
                  //Visual Assets: ???
                  //Sound: Careful, keep your arms up
                }
                else{
                  console.log("Fall");
                }
            }
          }
          else{
            console.log("Idle");
          }
        }
      });
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
