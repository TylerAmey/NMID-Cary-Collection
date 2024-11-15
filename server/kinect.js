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

          // Calculate distance from Kinect (spine base Z coordinate)
          const distance = joints[Kinect2.JointType.spineBase].cameraZ;
          console.log(`User distance: ${distance.toFixed(2)} meters`);

          if (distance <= 3.66) {
            //console.log("Action: 12 feet away");
            // action
          } else if (distance <= 1.83) {
            //console.log("Action: 6 feet away");
            // action
          } else if (distance <= 0.91) {
            //console.log("Action: 3 feet away");
            // action
          }

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

          if (isTpose) {
            //console.log("Action: T-pose detected");
            // action
          }
        }
      });
    });

    kinect.openBodyReader();
  } else {
    console.log("Kinect not connected!");
  }
}

module.exports = { startKinect };
