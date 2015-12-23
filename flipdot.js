"use strict";


var dotsy = 7;
var dotsx = 28;
var allon = 0b1111111;

function FlipdotController(address) {
	this.isDirty = false;
	this.dots = new Uint8Array(dotsx);
	this.address = address;
}

FlipdotController.prototype.clear = function(toWhite) {
	var val = toWhite ? 127 : 0;
	this.dots.fill(val);
	this.isDirty = true;
};

FlipdotController.prototype.setDots = function(dots) {
	this.isDirty = true;
	this.dots = dots;
};

// memoizing the bitmasks to set a specific pixel
var bitonarraymask = (new Array(6)).fill(0).map((n, i) => 1 << i);
var bitoffarraymask = (new Array(6)).fill(0).map((n, i) => allon - (1 << i));

FlipdotController.prototype.setPixel = function(on, x, y) {
	this.isDirty = true;
	var bit = 2 ^ y;
	if (on) {
		this.dots[x] |= bitonarraymask[y];
	} else {
		this.dots[x] &= bitoffarraymask[y];
	}
};

FlipdotController.prototype.invert = function() {
	this.isDirty = true;
	var inverted = this.dots.map(val => val ^ allon);
	this.dots = inverted;
};

FlipdotController.prototype.writeDots = function(outputArray) {
	if (this.isDirty) {
		outputArray.push(0x80);
		outputArray.push(0x83);
		outputArray.push(this.address);
		Array.prototype.push.apply(outputArray, this.dots);
		outputArray.push(0x8f);
		this.isDirty = false;
	}
};


var signrows = 2 * 2;
var signcolumns = 1;

function FlipdotManager(startAddress) {
	this.totalsigns = signrows * signcolumns;
	this.controllers = [];
	for (var i = 0; i < signcolumns; i++) {
		this.controllers[i] = [];
		for (var j = 0; j < signrows; j++) {
			this.controllers[i][j] = new FlipdotController(startAddress + i + j * signrows);
		}
	}
}

FlipdotManager.prototype.getControllerByPixel = function(x, y) {
	// memoize this...
	var col = Math.floor(x / dotsx);
	var row = Math.floor(y / dotsy);
	return this.controllers[col][row];
};

FlipdotManager.prototype.setPixel = function(on, x, y) {
	var fd = this.getControllerByPixel(x, y);
	fd.setPixel(on, x % dotsx, y % dotsy);
};

FlipdotManager.prototype.buildInstruction = function() {
	var instruction = [];//new Array(totalsigns * 32);
	for (var i = 0; i < this.controllers.length; i++) {
		var c = this.controllers[i];
		for (var j = 0; j < c.length; j++) {
			c[j].writeDots(instruction);
		}
	}
	if (instruction.length) {
		return instruction;
	}
};

FlipdotManager.prototype.drawPixels = function(pixels, x, y) {
	// find start sign of x, y
	// slice pixels into 
}

module.exports.FlipdotController = FlipdotController;
module.exports.FlipdotManager = FlipdotManager;
