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

var mode = "all";

var textStart = [
	"DANDELION",
	"CHOCOLATE",
	"HAPPY NEW",
	"  YEAR   "
];

var textEnd = [
	"GO WATCH ",
	"   THE   ",
	"FIREWORKS",
	"         "
];

function drawText() {
	textStart.forEach((s, i) => fdm.drawNativeText(s, i));

	var instruction = fdm.buildInstruction();
	queue.push(instruction);
	setTimeout(doTransition, 4000);
}

function* transitionGenerator(transitions) {
	var l = Math.max.apply(null, transitions.map(t => t.length));
	for (var i = 0; i < l; i++) {
		var merged = transitions.reduce((prev, next) => {
			if (i < next.length) {
				 return prev.concat(next[i]);
			} else {
				return prev;
			}
		}, []);
		yield merged;
	}
}

function doTransitionBack() {
	var transitions = textStart.map((s, i) => buildTransition(textEnd[i], s, i));

	for (var instruction of transitionGenerator(transitions)) {
		queue.push(instruction);
	}
	setTimeout(doTransition, 4000);
}

function doTransition() {
	var transitions = textStart.map((s, i) => buildTransition(s, textEnd[i], i));
	for (var instruction of transitionGenerator(transitions)) {
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
