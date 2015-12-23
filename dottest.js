"use strict";

var SerialPort = require("serialport").SerialPort
var FD = require("./flipdot");

var fdm = new FD.FlipdotManager(12);
var serialPort = new SerialPort("/dev/ttyAMA0", {
  baudrate: 57600
});

serialPort.on("open", function () {
  console.log("open");
//  randomDots();
	fdm.controllers.forEach(conts => conts.forEach(cont => cont.clear()));
	fdm.setPixel(true, 0,0);
	fdm.setPixel(true, 1,1);
	fdm.setPixel(true, 5,5);
	fdm.setPixel(true, 7,7);
	fdm.setPixel(true, 8,8);
	fdm.setPixel(true, 10,10);
	fdm.setPixel(true, 0,13);
	fdm.setPixel(true, 0,14);
	fdm.setPixel(true, 0, 26);
	fdm.setPixel(true, 0, 27);
	var instruction = fdm.buildInstruction();
	if (instruction) {
		serialPort.write(instruction, dieOnError);
	}
});

var width = 28;
var height = 28;

function randomDots() {
	fdm.controllers.forEach(conts => conts.forEach(cont => cont.clear()));
	for (let i of Array(160)) {
		let x = Math.floor(Math.random() * width);
		let y = Math.floor(Math.random() * height);
		fdm.setPixel(true, x, y);
	}
		fdm.setPixel(true, 1, 27);
	var instruction = fdm.buildInstruction();
	if (instruction) {
		serialPort.write(instruction, dieOnError);
	}
	setTimeout(invertedRandom, 1000);
}

function invertedRandom() {
        fdm.controllers.forEach(conts => conts.forEach(cont => cont.invert()));
        var instruction = fdm.buildInstruction();
        if (instruction) {
                serialPort.write(instruction, dieOnError);
        }
setTimeout(function() {
        for (let i of Array(160)) {
                let x = Math.floor(Math.random() * width);
                let y = Math.floor(Math.random() * height);
                fdm.setPixel(false, x, y);
        }
        var instruction = fdm.buildInstruction();
        if (instruction) {
                serialPort.write(instruction, dieOnError);
        }
        setTimeout(randomDots, 1000);
}, 400);
}

function dieOnError(err) {
	if (err) {
		console.log("fatal error.");
		throw err;
	}
}
