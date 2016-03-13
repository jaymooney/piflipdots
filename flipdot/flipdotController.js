"use strict";

const DOTS_Y = 7;
const DOTS_X = 28;
const ALL_ON = 0b1111111;

var FlipdotController = module.exports = exports = function FlipdotController(address) {
	this.isDirty = false;
	this.dots = new Uint8Array(DOTS_X);
	this.address = address;
};

FlipdotController.DOTS_Y = DOTS_Y;
FlipdotController.DOTS_X = DOTS_X;

FlipdotController.prototype.cloneDots = function() {
	return this.dots.slice(0);
};

FlipdotController.prototype.clear = function(toWhite) {
	var val = toWhite ? ALL_ON : 0;
	this.dots.fill(val);
	this.isDirty = true;
};

FlipdotController.prototype.setDots = function(dots) {
	this.isDirty = true;
	this.dots = dots;
};

FlipdotController.prototype.setColumn = function(index, val) {
	this.isDirty = true;
	this.dots[index] = val;
};

// memoizing the bitmasks to set a specific pixel
var bitonarraymask = (new Array(DOTS_Y)).fill(0).map((n, i) => 1 << i);
var bitoffarraymask = (new Array(DOTS_Y)).fill(0).map((n, i) => ~(1 << i));

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
	var inverted = this.dots.map(val => val ^ ALL_ON);
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