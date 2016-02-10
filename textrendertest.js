"use strict";

var FD = require("./flipdot");

var fdm = new FD.FlipdotManager(4, 4, 0);

let NUM_CHARS = Math.floor(fdm.width / 6);

fdm.clearAll(false);
fdm.renderDots();
fdm.invertAll();
fdm.renderDots();
fdm.invertAll();
fdm.renderDots();

setTimeout(drawText, 1000);


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
	"free hot chocolate",
	"for everybody!",
	"",
	"",
	"...except greg",
	"",
	"",
	"bitch"
].map(textPand);

var transitionTime = 20 * 1000;

function drawText() {
	textStart.forEach((s, i) => fdm.drawNativeText(s, i));
	fdm.renderDots();

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
	textStart.map((s, i) => buildTransition(textEnd[i], s, i));

	setTimeout(doTransition, transitionTime);
}

function doTransition() {
	textStart.map((s, i) => buildTransition(s, textEnd[i], i));

	setTimeout(doTransitionBack, transitionTime);
}

function buildTransition(start, end, row) {
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
		fdm.renderDots();
	}
}
