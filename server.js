const Hapi = require('hapi');
const Boom = require('boom');

const firebase = require("firebase-admin");
let ref;
let db;

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
  port: process.env.PORT || 8000,
  routes: {
    cors: {
      credentials: true,
      exposedHeaders: ['x-response-time']
    }
  }
});

//Register Plugins
server.register(require('inert'), function(err){
  if (err) {
    throw err;
  }
})

// Add the route
server.route([
  {
    method: 'GET',
    path:'/',
    handler: function (request, reply) {
      return reply('hello world');
    }
  }
]);

// Start the server
server.start((err) => {

  if (err) {
    throw err;
  }

  // Initialize the app with a service account, granting admin privileges
  const serviceAccount = require("./rpi.log");
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://rpi-ping-pong.firebaseio.com"
  });

  //Start listening to buttons
  const Gpio = require('pigpio').Gpio;

  let lastTeam = null;
  const led = new Gpio(17, {mode: Gpio.OUTPUT});

  // Team A
  const teamA = new Gpio(4, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_DOWN,
    edge: Gpio.EITHER_EDGE
  });
  teamA.teamName = 'A';
  teamA.on('interrupt', function (level) {
    if (!lastTeam) {
      //Start the Game
    } else {
      lastTeam = teamA.teamName;
      led.digitalWrite(level);
      //Save records to Firebase DB
    }
  });
  
  // Team B
  const teamB = new Gpio(4, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_DOWN,
    edge: Gpio.EITHER_EDGE
  });
  teamA.teamName = 'B';
  teamB.on('interrupt', function (level) {
    if (!lastTeam) {
      //Start the Game
    } else {
      lastTeam = teamB.teamName;
      led.digitalWrite(level);
      //Save records to Firebase DB
    }
  });

  // As an admin, the app has access to read and write all data, regardless of Security Rules
  db = firebase.database();
  ref = db.ref("games");

  console.log('Server running at:', server.info.uri);
});