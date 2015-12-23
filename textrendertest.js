"use strict";

var SerialPort = require("serialport").SerialPort
var FD = require("./flipdot");

var fdm = new FD.FlipdotManager(2, 2, 8);

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

var startText0 = "Hi Todd! ".toUpperCase();
var startText1 = "Merryxmas".toUpperCase();

function drawText() {
	fdm.drawNativeText(startText0, 0);
	fdm.drawNativeText(startText1, 1);

	var instruction = fdm.buildInstruction();
	queue.push(instruction);
	setTimeout(doTransition, 4000);
}

function doTransition() {
	var i1 = buildTransition(startText0, "Dandelion".toUpperCase(), 0);
	var i2 = buildTransition(startText1, "Chocolate".toUpperCase(), 1);
	var l = Math.max(i1.length, i2.length)
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
	};
}

function buildTransition(start, end, row) {
	var instructions = [];
	var current = start;
	while (current !== end) {
		console.log(`${current} : ${end}`);
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

setInterval(drawNext, 120);

function drawNext() {
	if (queue.length) {
		var i = queue.shift();
		serialPort.write(instruction, function(err) { if (err) throw err; });
	}
}
