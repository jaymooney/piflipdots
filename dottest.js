"use strict";

var SerialPort = require("serialport").SerialPort
var FD = require("./flipdot");

var fdm = new FD.FlipdotManager(2, 2, 8);
var serialPort = new SerialPort("/dev/ttyAMA0", {
  baudrate: 57600
});

serialPort.on("open", function () {
  console.log("open");
  randomDots();
});

var width = fdm.width;
var height = fdm.height;

function randomDots() {
	fdm.controllers.forEach(conts => conts.forEach(cont => cont.clear()));
	for (let i of Array(360)) {
		let x = Math.floor(Math.random() * width);
		let y = Math.floor(Math.random() * height);
		fdm.setPixel(true, x, y);
	}
	var instruction = fdm.buildInstruction();
	if (instruction) {
		serialPort.write(instruction, dieOnError);
	}
	setTimeout(invertedRandom, 100);
}

function invertedRandom() {
        fdm.controllers.forEach(conts => conts.forEach(cont => cont.invert()));
        var instruction = fdm.buildInstruction();
        if (instruction) {
                serialPort.write(instruction, dieOnError);
        }
setTimeout(function() {
        for (let i of Array(260)) {
                let x = Math.floor(Math.random() * width);
                let y = Math.floor(Math.random() * height);
                fdm.setPixel(false, x, y);
        }
        var instruction = fdm.buildInstruction();
        if (instruction) {
                serialPort.write(instruction, dieOnError);
        }
        setTimeout(randomDots, 100);
}, 100);
}

function dieOnError(err) {
	if (err) {
		console.log("fatal error.");
		throw err;
	}
}
