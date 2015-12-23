"use strict";

var Canvas = require("canvas");
var TextRenderer = require("./textrenderer");

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

FlipdotController.prototype.setColumn = function(index, val) {
	this.isDirty = true;
	this.dots[index] = val;
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

function blackOrWhitify(imageData, pixelOffset) {
	var luminance = imageData[pixelOffset] * 0.21 + imageData[pixelOffset + 1] * 0.72 + imageData[pixelOffset + 2] * 0.07;
	return luminance > 127;
}

function blackOrWhitify2(imageData, pixelOffset) {
	var luminance = (imageData[pixelOffset] + imageData[pixelOffset + 1] + imageData[pixelOffset + 2]) / 3;
	return luminance > 127;
}

function FlipdotManager(numRows, numCols, startAddress) {
	numRows *= 2;
	this.width = numCols * dotsx;
	this.height = numRows * dotsy;
	this.controllers = [];
	for (var i = 0; i < numCols; i++) {
		this.controllers[i] = [];
		for (var j = 0; j < numRows; j++) {
			this.controllers[i][j] = new FlipdotController(startAddress + j + i * numRows);
		}
	}
	this.canvas = new Canvas(this.width, this.height);
	var ctx = this.canvas.getContext("2d");
	ctx.antialias = "none";
	ctx.imageSmoothingEnabled = false;
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, this.width, this.height);
	this.ctx = ctx;
}

FlipdotManager.prototype.drawNativeText = function(text, row) {
	var data = TextRenderer.makeSentence(text);
	for (var i = 0; i < data.length; i++) {
		if (i >= this.width) {
			// no wrapping. yet.
			break;
		}
		var col = Math.floor(i / dotsx);
		this.controllers[col][row].setColumn(i % dotsx, data[i]);
	};
};

FlipdotManager.prototype.drawCanvasText = function(text, x, y) {
	var ctx = this.ctx;
	ctx.fillStyle = "#fff";
	ctx.font = "14px OPTICaslonBold-Cond";
	ctx.textAlign = "left";
	ctx.textBaseline = "hanging";
	ctx.fillText(text, x, y);
};

FlipdotManager.prototype.drawCanvasImage = function(imageData, sizeToFit) {
	var img = new Canvas.Image;
	img.src = imageData;
	if (sizeToFit) {
		this.ctx.drawImage(img, 0, 0, this.width, this.height);
	} else {
		this.ctx.drawImage(img, 0, 0);
	}
};

FlipdotManager.prototype.getControllerByPixel = function(x, y) {
	// memoize this...
	var col = Math.floor(x / dotsx);
	var row = Math.floor(y / dotsy);
	return this.controllers[col][row];
};

FlipdotManager.prototype.everySign = function (f) {
	this.controllers.forEach(conts => conts.forEach(f));
};

FlipdotManager.prototype.clearAll = function (toWhite) {
	this.everySign(controller => controller.clear(toWhite));
};

FlipdotManager.prototype.invertAll = function () {
	this.everySign(controller => controller.invert());
};

FlipdotManager.prototype.setPixel = function(on, x, y) {
	var fd = this.getControllerByPixel(x, y);
	fd.setPixel(on, x % dotsx, y % dotsy);
};

FlipdotManager.prototype.copyFromCanvas = function() {
	var imageData = this.ctx.getImageData(0, 0, this.width, this.height);
	var pixel = 0;
	for (var x = 0; x < imageData.width; x++) {
		for (var y = 0; y < imageData.height; y++) {
			var val = blackOrWhitify2(imageData.data, pixel)
			this.setPixel(val, x, y);
			pixel += 4;
		}
	}
};

FlipdotManager.prototype.buildInstruction = function() {
	var instruction = [];
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
