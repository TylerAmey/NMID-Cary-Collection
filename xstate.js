// how to use:
// ensure that xmage is installed. you should be able to just call npm install, but the exact
// line i called was 'npm install  xstate@5.19.0'
// then, to run just this script, call 'node xstate.js'

const { createMachine, createActor } = require('xstate');

const testFunction = (variable) => {
  console.log(variable);
}

// this is a state machine. here's how it works
const circusManager = createMachine({

  // you can ignore the id
  id: 'cyrk',

  // the initial state of the machine
  initial: 'intro',

  // ALL states of the machine. All states are:
  // intro, idle, midway, pose, outro
  states: {

    // this is a state. its also our starting state
    intro: {

      // 'on' is essentially a requirement to call 'on' the machine to do something
      on: {

        // toggle is a function that tells the machine to do something. in this case,
        // it calls the machine to 'target' the 'idle' state. that means
        // it will CHANGE TO THE IDLE STATE WHEN CALLED
        toggle: { target: 'idle' }
      }
    },

    idle: {
      on: {
        toggle: { target: 'midway' }
      }
    },

    midway: {
      on: {
        toggle: { target: 'pose' }
      }
    },

    // pose is slightly different. it's 'on' state has two possibilities:
    // pass or fail. They are called similar to toggle. WHEN you are at the pose state,
    // you can call pass/fail to do something. 
    pose: {
      on: {
        pass: {
          // we still target a next state
          target: 'idle',

          // but we can also call functions
          // NOTICE this function is 'outside' of the statemachine. 
          // therefor, it can utilize data that it has access to in the
          // file it's in
          actions: () => testFunction('pass')
        },
        fail: {
          target: 'idle',
          actions: () => testFunction('fail')
        }
      }
    },
    outro: {
      on: {
        toggle: { target: 'intro' }
      }
    }
  }
});

// this creates an 'actor,' or an instance of the machine
const cyrkService = createActor(circusManager);

// subscribe simply returns the 'state' of the machine. 
cyrkService.subscribe((state) => {
  console.log(state.value);
});

// TEST CODE 1 (uncomment this and comment out ALL of TEST CODE 2 to use)
// this code utilizes the toggle functionality to switch the state of the machine
// the goal in this code is to call the 'pose' state by it's pass/fail state
/* 

cyrkerService.start();

cyrkService.send({ type: 'toggle' });
cyrkService.send({ type: 'toggle' });

cyrkService.send({ type: 'toggle' });
cyrkService.send({ type: 'pass' });

cyrkService.send({ type: 'toggle' });

cyrkService.send({ type: 'toggle' });
cyrkService.send({ type: 'fail' }); */

// TEST CODE 2
// this code also utilizes the toggle functionality, but is more of an example
// to display how the Machine can be used perpetually and influenced. 

// simple counter.
let counter = 0;

// this function calls the toggle functionality of the states, and does something
// if the state is a certain value ('pose')
const timedFunction = () => {
  // calling a snapshot will naturally print out the value, however
  cyrkService.send({ type: 'toggle' });

  // we can also check for the value. if it's equal to pose, we can modify information
  // note that we are modifying information OUTSIDE of the machine, but it is possible
  // to hold info in the machine also and modify it
  if(cyrkService.getSnapshot().value === 'pose'){
    counter++;
    console.log(`Counter:${counter}`);
  };
};

// this turns on the machine
cyrkService.start();

// this is a way of running the machine perpetually to get output
// i need this to run the demo in the powershell, if an instance of a script
// is running elsewhere then the machine should stay on without a timer.
let interval = setInterval(timedFunction, 1000);




