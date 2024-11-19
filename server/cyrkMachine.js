const { createMachine, createActor, assign } = require('xstate');


// logVariableStatus
// function logs the status of variables in the stateMachine for testing purposes
const logVariableStatus = (variableName, value) => {
    console.log(`${variableName} is ${value ? 'true' : 'false'}`);
};

const informCanvas = (variable) => {
    console.log(`Play animation/audio related to ${variable}`);
}


// the state machine
const circusManager = createMachine(
    {
        // id is unimportant
        id: 'cyrk',

        // initial state
        initial: 'idle',

        // context is just data we keep inside of the machine
        // pose cares about kinect data
        // canvasReady cares about the state of the canvas
        context: {
            pose: false,
            canvasReady: false,
            startUp: false,
            ignoredPoseOnStartup: false,
            midWay: false,
            pastMidWay: false,
            fallen: false,
            bowed: false,
        },

        // list of states.
        // idle, start, stepup, midway, bow, end, outro
        states: {

            idle: {
            
                on: {
                    start: {
                        target: 'start',
                    }
                }
                
            },

            // this is a state
            start: {

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
                        //guard: 'canToggle',

                        // target is telling the machine to go to the
                        // next state. 
                        target: 'stepUp',
                    },
                },
            },

            // stepUp is a parent state with multiple child states
            stepUp: {

                // intial state is referred to as stepUpIdle
                initial: 'stepUpIdle',

                states: {

                    // steupIdle is when the user is stepped up
                    // when called to toggle, it will look if the user
                    // has started their t-pose
                    stepUpIdle: {

                        on: {
                            toggle: [

                                // these are nested guards. if this first one succeeds,
                                // the others won't be called.
                                {
                                    guard: 'ignoredPose',
                                    target: 'ready',
                                },
                                {
                                    guard: 'canvasReady',
                                    target: 'ready',
                                },

                                {
                                    guard: 'waitedTooLong',
                                    target: 'stepUpFailed'
                                }

                            ],
                        },
                    },

                    stepUpFailed: {

                        on: {
                            toggle: [

                                {
                                    guard: 'canvasReady',
                                    target: 'stepUpIdle',
                                },

                            ],
                        },
                    },

                    // ready is a generic state meant to move to the 
                    // 'onDone' action, which is a fancy way of saying we're
                    // ready to move onto the next Parent state
                    ready: {
                        type: 'final',
                    }
                },

                onDone: {
                    target: 'walking',
                }
            },

            walking: {

                entry: [
                    ({ context }) => informCanvas(context.pose),
                ],

                on: {

                    toggle: [

                        {
                            guard: 'hasFallen',
                            target: 'falling'
                        },



                        {
                            guard: 'isMidWay',
                            target: 'midWay',
                        }

                    ]
                }
            },

            midway: {
                on: {
                    toggle: {
                        guard: 'canvasReady',
                        target: 'walking',
                    },
                },
            },

            end: {
                initial: 'endIdle',

                states: {
                    endIdle: {
                        on: {
                            toggle: [

                                {
                                    guard: 'hasFallen',
                                    target: 'falling'
                                },

                                // wait until the canvas is ready to check for bow
                                // going to endBow is an automatic check;
                                {
                                    guard: 'canvasReady',
                                    target: 'endBow',
                                }
                            ]
                        }

                    },

                    endBow: {
                        on: {
                            toggle: [
                                {
                                    guard: 'hasBowed',
                                    target: 'ready',
                                },
                                {
                                    target: 'endBowFail'
                                }
                            ]
                        }
                    },

                    endBowFail: {

                    },

                    ready: {
                        type: 'final',
                    }

                },
                onDone: {
                    target: 'walking',
                }
            },

            outro: {
                on: {
                    toggle: {
                        guard: 'canToggle',
                        target: 'idle',
                    },
                },
            },
        },

        // this generic 'on' is available for all states
        // thus far they just care about setting the values of some
        // context
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

                    ({ context }) => logVariableStatus("canvasReady", context.canvasReady),

                ]
            },

            setFallenState: {
                actions: [
                    assign(({ event }) => {
                        return {
                            fallen: event.value,
                        }
                    }),

                    ({ context }) => logVariableStatus("fallen", context.fallen),
                ]
            },

            setBowed: {
                actions: [
                    assign(({ event }) => {
                        return {
                            bowed: event.value,
                        }
                    }),

                    ({ context }) => logVariableStatus("bowed", context.bowed),
                ]
            },

            reachedMidway: {
                actions: [
                    assign(({ event }) => {
                        return {
                            midWay: event.value,
                        }
                    }),

                    ({ context }) => logVariableStatus('midWay', context.midWay,)
                ]
            },

            checkIfPosing: {

                actions: [
                    ({ context }) => informCanvas(context.pose),
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
           
            //all guards are basically just looking at the context valuess
            canvasReady: ({ context }) => context.canvasReady,

            posing: ({ context }) => context.pose,

            hasFallen: ({ context }) => context.fallen,

            hasBowed: ({ context }) => context.hasBowed,
        },
    }
);

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


const setBow = (value) => {
    cyrkService.send({ type: 'setBowed', value });
    cyrkService.send({ type: 'toggle' });

}

const setFallen = (value) => {
    cyrkService.send({ type: 'setFallen', value });
    cyrkService.send({ type: 'toggle' });
}

const startMachine = () => {
    // cyrkService is the value assigned to the 'actor' that is the stateMachine
    // think of it as an object, almost
    const cyrkService = createActor(circusManager);

    // subscribing to the state service allows the machine to tell
    // us whenever something happens.
    // we could possibly remove the code
    cyrkService.subscribe((state) => {
        console.log('State:', state.value);
    });

    // start starts it, babyyyyy
    cyrkService.start();
}

module.exports = {
    setPose,
    setCanvasReady,
    setBow,
    setFallen,
    startMachine,
};
