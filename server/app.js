const express = require("express");
const path = require("path");
const kinectLogic = require("./kinect");

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, "../public")));

// Start the Kinect tracking
kinectLogic.startKinect();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
