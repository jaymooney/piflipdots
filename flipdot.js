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
var bitonarraymask = (new Array(7)).fill(0).map((n, i) => 1 << i);
var bitoffarraymask = (new Array(7)).fill(0).map((n, i) => ~(1 << i));

FlipdotController.prototype.setPixel = function(on, x, y) {
	this.isDirty = true;
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

function FlipdotManager(numRows, numCols, startAddress) {
	this.totalsigns = numRows * numCols;
	this.controllers = [];
	for (var i = 0; i < numCols; i++) {
		this.controllers[i] = [];
		for (var j = 0; j < numRows; j++) {
			this.controllers[i][j] = new FlipdotController(startAddress + j + i * numRows);
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

FlipdotManager.prototype.copyFromCanvas = function(ctx) {}
	var imageData = ctx.getImageData(0, 0, width, height);
	var pixel = 0;
	for (var x = 0; x < imageData.width; x++) {
		for (var y = 0; y < imageData.height; y++) {
			var val = blackOrWhitify(imageData.data, pixel)
			fpm.setPixel(val, x, y);
			pixel += 4;
		}
	}
};

FlipdotManager.prototype.buildInstruction = function() {
	var instruction = [];//new Array(this.totalsigns * 32);
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
