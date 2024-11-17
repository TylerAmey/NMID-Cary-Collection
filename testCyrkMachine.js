const { setPose, setCanvasReady } = require('./server/cyrkMachine.js');

// Simulate toggling states by updating context values
console.log('Initial State Test:');
setPose(false); // pose: false
setCanvasReady(false); // canvasReady: false

// Update only pose
console.log('\nTesting Pose Update:');
setPose(true); // pose: true

// Update only canvasReady
console.log('\nTesting Canvas Ready Update:');
setCanvasReady(true); // canvasReady: true

// Both are true now; the machine should toggle
console.log('\nTesting Both True (Should Toggle):');
setPose(false); // pose: false
setCanvasReady(false); // Reset
setPose(true); 
setCanvasReady(true); // This should trigger the toggle
