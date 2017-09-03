var admin = require("firebase-admin");

var serviceAccount = require("./rpi.log");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://rpi-ping-pong.firebaseio.com"
});



var Gpio = require('pigpio').Gpio,
  button = new Gpio(4, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_DOWN,
    edge: Gpio.EITHER_EDGE
  }),
  led = new Gpio(17, {mode: Gpio.OUTPUT});
 
button.on('interrupt', function (level) {
  led.digitalWrite(level);
});
