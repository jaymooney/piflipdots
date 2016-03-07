"use strict";

var serial = require("./serial");

const DEFAULT_REFRESH_RATE = 100;
var queue = [];

function startEngine() {
	drawNext();
}

module.exports.push = function push(instruction) {
	if (instruction) {
		queue.push(instruction);
	}
}

module.exports.clear = function clear() {
	queue = [];
};

function drawNext() {
	var delay = DEFAULT_REFRESH_RATE;
	if (queue.length) {
		var i = queue[0];
		if (Array.isArray(i)) {
			serial.write(i);
			queue.shift();
		} else {
			if (i.speed) {
				delay = i.speed;
			}
			let next = i.nextInstruction();
			if (next) {
				serial.write(next);
			}
			if (i.done) {
				queue.shift();
			}
		}

	}
	setTimeout(drawNext, delay);
}


serial.open(startEngine);
