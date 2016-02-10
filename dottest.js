"use strict";

var FD = require("./flipdot");

const NUMTOSET = 1000;
const DELAY = 200;

var fdm = new FD.FlipdotManager(4, 4, 0);

setTimeout(randomDots, 1000);

let width = fdm.width;
let height = fdm.height;

function randomDots() {
	fdm.clearAll();
	randomize(true);
	setTimeout(invertedRandom, DELAY);
}

function invertedRandom() {
        fdm.invertAll();
        fdm.renderDots();
	setTimeout(function() {
		randomize(false);
        	setTimeout(randomDots, DELAY);
	}, DELAY);
}

function randomize(onoff) {
        for (let i of Array(NUMTOSET)) {
                let x = Math.floor(Math.random() * width);
                let y = Math.floor(Math.random() * height);
                fdm.setPixel(onoff, x, y);
        }
        fdm.renderDots();
}
