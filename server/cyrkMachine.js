const { createMachine, createActor, assign } = require('xstate');


// logVariableStatus
// function logs the status of variables in the stateMachine for testing purposes
const logVariableStatus = (variableName, value) => {
    console.log(`${variableName} is ${value ? 'true' : 'false'}`);
};

// the state machine
const circusManager = createMachine(
    {
        // id is unimportant
        id: 'cyrk',

        // initial state
        initial: 'intro',

        // context is just data we keep inside of the machine
        // pose cares about kinect data
        // canvasReady cares about the state of the canvas
        context: {
            pose: false,
            canvasReady: false,
        },

        // list of states.
        // intro, idle, midway, end
        states: {

            // this is a state
            intro: {

                // on indicates an action. 
                on: {

                    startCanvas: {
                        // call some export function
                    },

                    // toggle is an action. it's sorta a mini function
                    toggle: {

                        // guard is a condition that is checked before
                        // anything else in the action can proceed.
                        // the guard is referencing canToggle, which
                        // is near the end of the machine
                        guard: 'canToggle',

                        // target is telling the machine to go to the
                        // next state. 
                        target: 'idle',
                    },
                },
            },
            idle: {
                on: {
                    toggle: {
                        guard: 'canToggle',
                        target: 'midway',
                    },
                },
            },
            midway: {
                on: {
                    toggle: {
                        guard: 'canToggle',
                        target: 'outro',
                    },
                },
            },
            outro: {
                on: {
                    toggle: {
                        guard: 'canToggle',
                        target: 'intro',
                    },
                },
            },
        },

        // this generic 'on' is available for all states
        // we have two actions here, setPose and setCanvasReady
        // which care about the user pose and the canvas's current
        // condition (playing audio, looping through sprites, etc.)
        on: {
            setPose: {
                // actions is a keyword that tells the stateMachine to do something
                actions: [

                    // in this case, we are assigning the value of pose to the event.value
                    assign(({ event }) => {
                        return {
                            pose: event.value,
                        }
                    }),

                    // call to external function is mostly to prove it's possible to call
                    // the external function
                    ({ context }) => logVariableStatus("pose", context.pose),

                ],

            },
            setCanvasReady: {
                actions: [
                    assign(({ event }) => {
                        return {
                            canvasReady: event.value,
                        }
                    }),

                    ({ context }) => logVariableStatus("canvasReady", context.pose),

                ]
            },

            // this doesn't do antying. in theory it should be selfsufficient for the machine
            // to call a toggle itself but i can't figure it out rn
            attemptToggle: {

            }
        },


    },
    {
        // these gaurds are available for all states of the machine
        guards: {
            // guard to check if both pose and canvasReady are true
            // there is an implied return
            canToggle: ({ context }) => context.pose && context.canvasReady,
        },
    }
);



// subscribing to the state service allows the machine to tell
// us whenever something happens.
// we could possibly remove the code
cyrkService.subscribe((state) => {
    console.log('State:', state.value);
});

// start starts it, babyyyyy
cyrkService.start();

// setPose and setCanvasReady are both exported functions that take a value
// of some sort (a bool for right now, but that can change) and updates the canvas
const setPose = (value) => {
    cyrkService.send({ type: 'setPose', value });
    cyrkService.send({ type: 'toggle' });
};

const setCanvasReady = (value) => {
    cyrkService.send({ type: 'setCanvasReady', value });
    cyrkService.send({ type: 'toggle' });
};

const startMachine = () => {
    // cyrkService is the value assigned to the 'actor' that is the stateMachine
    // think of it as an object, almost
    const cyrkService = createActor(circusManager);
}

module.exports = {
    setPose,
    setCanvasReady,
};
