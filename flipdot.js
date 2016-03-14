"use strict";

var InstructionEngine = require("./flipdot/instructionEngine");
var TextRenderer = require("./flipdot/textrenderer");
var FlipdotController = require("./flipdot/flipdotController");
var Transitions = require("./flipdot/transitions");
var Canvas = require("./flipdot/canvasRenderer");

function textPand(str, fullLength) {
	str = str.toUpperCase();
	let toAdd = fullLength - str.length;
	if (toAdd === 0) {
		return str;
	}
	return str + Array(toAdd).fill(" ").join("");
}

function FlipdotManager(numRows, numCols, startAddress) {
	this.test = false;
	numRows *= 2;
	this.width = numCols * FlipdotController.DOTS_X;
	this.height = numRows * FlipdotController.DOTS_Y;
	this.textCols = Math.floor(this.width / 6);
	this.textRows = numRows;
	this.blankRow = textPand("", this.textCols);
	this.clearText();
	this.controllers = [];
	for (var i = 0; i < numCols; i++) {
		this.controllers[i] = [];
		for (var j = 0; j < numRows; j++) {
			this.controllers[i][j] = new FlipdotController(startAddress + j + i * numRows);
		}
	}
	this.allController = new FlipdotController(0xFF);
	this.canvas = new Canvas(this.width, this.height);
}

FlipdotManager.prototype.clearText = function() {
	this.text = Array(this.textRows).fill(this.blankRow);
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

FlipdotManager.prototype.copyFromCanvas = function() {
	this.canvas.copyToFlipdots(this);
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

FlipdotManager.prototype.enterTestContext = function() {
	if (this.test) {
		InstructionEngine.clear();
	} else {
		this.test = true;
	}
};

FlipdotManager.prototype.exitTestContext = function() {
	if (this.test) {
		InstructionEngine.clear();
		this.test = false;
	}
};

FlipdotManager.prototype.renderDots = function() {
	this.exitTestContext();
	InstructionEngine.push(this.buildInstruction());
};

FlipdotManager.prototype.makeTrainTextInstructionForRow = function(text, row) {
	this.exitTestContext();
	let transition = Transitions.makeTrainSignTransitionForRow(textPand(text, this.textCols), row, this);

	InstructionEngine.push(transition);
};

FlipdotManager.prototype.makeTrainTextInstruction = function(text) {
	this.exitTestContext();
	var textArray = text.split("\n");
	let len = textArray.length;
    if (len > this.textRows) {
        textArray.length = this.textRows;
    } else if (len < this.textRows) {
		textArray.length = this.textRows;
		textArray.fill(this.blankRow, len);
	}
    textArray = textArray.map(l => {
    	if (l.length < this.textCols) {
	    	return textPand(l, this.textCols);
	    }
	    if (l.length > this.textCols) {
	    	return l.substring(0, this.textCols);
	    }
	    return l;
    });
	let transition = Transitions.makeTrainSignTransition(textArray, this);

	InstructionEngine.push(transition);
};

FlipdotManager.prototype.fastFlip = function(speed) {
	this.enterTestContext();
	InstructionEngine.push(Transitions.makeFlipInstruction(speed, this));
};

FlipdotManager.prototype.flashAll = function(speed, numFlashes) {
	this.exitTestContext();

	let transition = Transitions.makeFlashInstruction(500, numFlashes, this);
	InstructionEngine.push(transition);
}

module.exports.FlipdotManager = FlipdotManager;
