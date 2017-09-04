const admin = require("firebase-admin");

const serviceAccount = require("./rpi.log");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://rpi-ping-pong.firebaseio.com"
});



const Gpio = require('pigpio').Gpio;

const button = new Gpio(4, {
  mode: Gpio.INPUT,
  pullUpDown: Gpio.PUD_DOWN,
  edge: Gpio.EITHER_EDGE
});
const led = new Gpio(17, {mode: Gpio.OUTPUT});
 
button.on('interrupt', function (level) {
  led.digitalWrite(level);
});
