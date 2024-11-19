// source - Austin from RIT
// https://github.com/IGM-RichMedia-at-RIT/basic-socket-io-done/blob/master/server/io.js 

const http = require('http');
const { Server } = require('socket.io');

let io;

const handleStageTrigger = (msg) => {
    io.emit(msg.channel, msg.message);
};

const socketSetup = (app) => {
    /* To create our Socket.IO server with our Express app, we first
          need to have the http library create a "server" using our Express
          app as a template. We then hand that server off to Socket.IO which
          will generate for us our IO server.
      */
    const server = http.createServer(app);
    io = new Server(server);
  
    /* Socket.IO is entirely built on top of an event system. Our server
          can send messages to clients, which trigger events on their side.
          In the same way, clients can send messages to the server, which
          trigger events on our side.
  
          The first event is the 'connection' event, which fires each time a
          client connects to our server. The event returns a "socket" object
          which represents their unique connection to our server.
      */
    io.on('connection', (socket) => {
      console.log('socket connected');
  
      /* With the socket object, we can handle events for that specific
              user. For example, the disconnect event fires when the user
              disconnects (usually by closing their browser window).
          */
      socket.on('disconnect', () => {
        console.log('socket disconnected');
      });
  
      /* We can also create custom events. For example, the 'chat message'
              event name is just one we made up. As long as the client and the
              server both know to use that name, we can use it.
  
              Here, whenever the user sends a message in the 'chat message'
              event channel, we will handle it with handleChatMessage.
          */
      socket.on('stage trigger', handleStageTrigger);
    });
  
    /* Finally, after our server is set up, we will return it so that we
          can start it in app.js.
      */
    return {server, io};
  };
  
  // We only export the one function from this file, just like in router.js
  module.exports = socketSetup;