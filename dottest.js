"use strict";

var SerialPort = require("serialport").SerialPort
var FD = require("./flipdot");

var fdm = new FD.FlipdotManager(12);
var serialPort = new SerialPort("/dev/ttyAMA0", {
  baudrate: 57600
});

serialPort.on("open", function () {
  console.log("open");
  randomDots();
});

var width = 28;
var height = 28;

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
	setTimeout(invertedRandom, 120);
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
        setTimeout(randomDots, 120);
}, 120);
}

function dieOnError(err) {
	if (err) {
		console.log("fatal error.");
		throw err;
	}
}
