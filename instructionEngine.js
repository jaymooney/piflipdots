"use strict";

var serialPort = require("./serial");

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

function drawNext() {
	if (queue.length) {
		var i = queue.shift();
		serial.write(i);

		// let delay = i.delay || DEFAULT_REFRESH_RATE;
	}
	setTimeout(drawNext, DEFAULT_REFRESH_RATE);
}


serial.open(startEngine);
