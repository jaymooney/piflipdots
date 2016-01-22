"use strict";

var SerialPort = require("serialport").SerialPort

var serialPort = new SerialPort("/dev/ttyAMA0", {
  baudrate: 57600
});

var black = new Array(32).fill(0);
var white = new Array(32).fill(0b1111111);
black[0] = white[0] = 0x80;
black[1] = white[1] = 0x83;
black[2] = white[2] = 0xFF;
black[31] = white[31] = 0x8F;

var state = true;

serialPort.on("open", function () {
  console.log("open");
  setInterval(flip, 100);
});

function flip() {
  serialPort.write(state ? white : black, function(err) {
	if (err) throw err;
  });
  state = !state;
}
