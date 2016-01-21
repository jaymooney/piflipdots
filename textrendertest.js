"use strict";

var SerialPort = require("serialport").SerialPort
var FD = require("./flipdot");

var fdm = new FD.FlipdotManager(4, 4, 0);

let NUM_CHARS = Math.floor(fdm.width / 6);

var queue = [];

var serialPort = new SerialPort("/dev/ttyAMA0", {
 	baudrate: 57600
});

serialPort.on("open", function () {
	console.log("serial port open");
	fdm.clearAll(false);
	var instruction = fdm.buildInstruction();
	queue.push(instruction);
	fdm.invertAll();
	instruction = fdm.buildInstruction();
	queue.push(instruction);
	fdm.invertAll();
	instruction = fdm.buildInstruction();
	queue.push(instruction);
	setTimeout(drawText, 1000);
});

var mode = "all";

function textPand(str) {
	str = str.toUpperCase();
	let toAdd = NUM_CHARS - str.length;
	if (toAdd === 0) {
		return str;
	}
	return str + Array(toAdd).fill(" ").join("");
}

var textStart = [
	"    WELCOME  TO",
	"",
	"     DANDELION",
	"",
	"    small batch",
	"",
	"     CHOCOLATE",
	""
].map(textPand);

var textEnd = [
	"HOT CHOCOLATE",
	"for everybody!",
	"",
	"",
	"",
	"...except greg",
	"",
	"bitch"
].map(textPand);

var transitionTime = 20 * 1000;

function drawText() {
	textStart.forEach((s, i) => fdm.drawNativeText(s, i));

	var instruction = fdm.buildInstruction();
	queue.push(instruction);
	setTimeout(doTransition, 4000);
}

function* transitionGenerator(transitions) {
	for (let t of transitions) {
		yield* t;
	}
}

function* transitionGenerator2(transitions) {
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
	setTimeout(doTransition, transitionTime);
}

function doTransition() {
	var transitions = textStart.map((s, i) => buildTransition(s, textEnd[i], i));
	for (var instruction of transitionGenerator(transitions)) {
		queue.push(instruction);
	}
	setTimeout(doTransitionBack, transitionTime);
}

function buildTransition(start, end, row) {
	var instructions = [];
	var current = start;
	while (current !== end) {
		for (var i = 0; i < current.length; i++) {
			if (current[i] !== end[i]) {
				var replacement;
				if (current[i] === " ") {
					if (end[i] > "Z" || end[i] < "A") {
						replacement = end[i];
					} else {
						replacement = "A";
					}
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
