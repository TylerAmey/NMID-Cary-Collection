const express = require("express");
const path = require("path");
const kinectLogic = require("./kinect");

const socketSetup = require('./io.js');

const app = express();
const PORT = 3000;

const {server, io} = socketSetup(app);

// Serve static files
app.use(express.static(path.join(__dirname, "../public")));

app.use('/assets', express.static(path.join(__dirname, '../assets')));

const setState = (state) => {
  // do something with new state
  io.emit('state', state);
}

// Start the Kinect tracking
//console.log(kinectLogic.startKinect.toString());
kinectLogic.startKinect(setState);

// Start the server
server.listen(PORT, (err) => {
  if (err){
    throw err;
  }
  console.log(`Server is running at http://localhost:${PORT}`);
});
