"use strict";

var Canvas = require("canvas");
var InstructionEngine = require("./instructionEngine");
var TextRenderer = require("./textrenderer");
var FlipdotController = require("./flipdotController");

function blackOrWhitify(imageData, pixelOffset) {
	var luminance = imageData[pixelOffset] * 0.21 + imageData[pixelOffset + 1] * 0.72 + imageData[pixelOffset + 2] * 0.07;
	return luminance > 188;
}

function blackOrWhitify2(imageData, pixelOffset) {
	var luminance = (imageData[pixelOffset] + imageData[pixelOffset + 1] + imageData[pixelOffset + 2]) / 3;
	return luminance > 127;
}

function FlipdotManager(numRows, numCols, startAddress) {
	numRows *= 2;
	this.width = numCols * FlipdotController.DOTS_X;
	this.height = numRows * FlipdotController.DOTS_Y;
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
		var col = Math.floor(i / FlipdotController.DOTS_X);
		this.controllers[col][row].setColumn(i % FlipdotController.DOTS_X, data[i]);
	};
};

FlipdotManager.prototype.drawCanvasText = function(text, x, y) {
	var ctx = this.ctx;
	ctx.fillStyle = "#fff";
	ctx.font = "18px OPTICaslonBold-Cond";
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

FlipdotManager.prototype.copyFromCanvas = function() {
	var imageData = this.ctx.getImageData(0, 0, this.width, this.height);
	var pixel = 0;
	for (var y = 0; y < imageData.height; y++) {
		for (var x = 0; x < imageData.width; x++) {
			var val = blackOrWhitify(imageData.data, pixel)
			this.setPixel(val, x, y);
			pixel += 4;
		}
	}
};


FlipdotManager.prototype.getControllerByPixel = function(x, y) {
	// memoize this...
	var col = Math.floor(x / FlipdotController.DOTS_X);
	var row = Math.floor(y / FlipdotController.DOTS_Y);
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
	fd.setPixel(on, x % FlipdotController.DOTS_X, y % FlipdotController.DOTS_Y);
};

FlipdotManager.prototype.buildInstruction = function() {
	var instruction = [];
	for (var i = 0; i < this.controllers.length; i++) {
		var c = this.controllers[i];
		for (var j = 0; j < c.length; j++) {
			c[j].writeDots(instruction);
		}
	}
	return instruction;
};

FlipdotManager.prototype.renderDots = function() {
	InstructionEngine.push(this.buildInstruction());
};

module.exports.FlipdotManager = FlipdotManager;
