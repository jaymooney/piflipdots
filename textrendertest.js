"use strict";

var SerialPort = require("serialport").SerialPort
var FD = require("./flipdot");

var fdm = new FD.FlipdotManager(1, 2, 8);

var queue = [];

var serialPort = new SerialPort("/dev/ttyAMA0", {
 	baudrate: 57600
});

serialPort.on("open", function () {
	console.log("serial port open");
	fdm.clearAll(false);
	var instruction = fdm.buildInstruction();
	queue.push(instruction);
	setTimeout(drawText, 1000);
});

var s0 = "Happy    ".toUpperCase();
var s1 = "New Year ".toUpperCase();
var e0 = "dandelion".toUpperCase();
var e1 = "chocolate".toUpperCase();

function drawText() {
	fdm.drawNativeText(s0, 0);
	fdm.drawNativeText(s1, 1);

	var instruction = fdm.buildInstruction();
	queue.push(instruction);
	setTimeout(doTransition, 4000);
}

function doTransitionBack() {
	var i1 = buildTransition(e0, s0, 0);
	var i2 = buildTransition(e1, s1, 1);
	var l = Math.max(i1.length, i2.length);
	for (var i = 0; i < l; i++) {
		var instruction = i1[i];
		if (instruction) {
			if (i2[i]) {
				instruction = instruction.concat(", ", i2[i]);
			}
		} else {
			instruction = i2[i];
		}
		queue.push(instruction);
	}
	setTimeout(doTransition, 4000);
}

function doTransition() {
	var i1 = buildTransition(s0, e0, 0);
	var i2 = buildTransition(s1, e1, 1);
	var l = Math.max(i1.length, i2.length);
	for (var i = 0; i < l; i++) {
		var instruction = i1[i];
		if (instruction) {
			if (i2[i]) {
				instruction = instruction.concat(", ", i2[i]);
			}
		} else {
			instruction = i2[i];
		}
		queue.push(instruction);
	}
	setTimeout(doTransitionBack, 4000);
}

function buildTransition(start, end, row) {
	var instructions = [];
	var current = start;
	while (current !== end) {
		for (var i = 0; i < current.length; i++) {
			if (current[i] !== end[i]) {
				var replacement;
				if (current[i] === " ") {
					replacement = "A";
				} else if (current[i] >= "Z" || current[i] < "A") {
					replacement = " ";
				} else {
					replacement = String.fromCharCode(current.charCodeAt(i) + 1);
				}
				current = current.substr(0, i) + replacement + current.substr(i + 1);
			}
		};

		fdm.drawNativeText(current, row);
		var instruction = fdm.buildInstruction();
		instructions.push(instruction);
	}
	return instructions;
}

setInterval(drawNext, 100);

function drawNext() {
	if (queue.length) {
		var i = queue.shift();
		serialPort.write(i, function(err) { if (err) throw err; });
	}
}
