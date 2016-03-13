"use strict";

var Canvas = require("canvas");

function blackOrWhitify(imageData, pixelOffset) {
	var luminance = imageData[pixelOffset] * 0.21 + imageData[pixelOffset + 1] * 0.72 + imageData[pixelOffset + 2] * 0.07;
	return luminance > 78;
}

function CanvasRenderer(w, h) {
	this.width = w;
	this.height = h;
	this.canvas = new Canvas(w, h);
	var ctx = this.canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, w, h);
	ctx.fillStyle = "#fff";
	ctx.textAlign = "center";
	ctx.textBaseline = "top";
	this.ctx = ctx;
}

CanvasRenderer.OPTI_CASLON = "18px OPTICaslonBold-Cond";
CanvasRenderer.HIGHWAY_GOTHIC = "8px 'Highway Gothic Expanded'";

CanvasRenderer.prototype.drawText = function(text, font, x, y) {
	var ctx = this.ctx;
	ctx.font = font;
	ctx.fillText(text, x, y);
};

CanvasRenderer.prototype.drawOptiText = function(text, x, y) {
	this.drawText(text, CanvasRenderer.OPTI_CASLON, x, y);
};

CanvasRenderer.prototype.drawGothicText = function(text, x, y) {
	this.drawText(text, CanvasRenderer.HIGHWAY_GOTHIC, x, y);
};

CanvasRenderer.prototype.drawImage = function(imageData, sizeToFit) {
	var img = new Canvas.Image;
	img.src = imageData;
	if (sizeToFit) {
		this.ctx.drawImage(img, 0, 0, this.width, this.height);
	} else {
		this.ctx.drawImage(img, 0, 0);
	}
};

CanvasRenderer.prototype.copyToFlipdots = function(fdm) {
	var imageData = this.ctx.getImageData(0, 0, this.width, this.height);
	var pixel = 0;
	for (var y = 0; y < imageData.height; y++) {
		for (var x = 0; x < imageData.width; x++) {
			var val = blackOrWhitify(imageData.data, pixel)
			fdm.setPixel(val, x, y);
			pixel += 4;
		}
	}
};

CanvasRenderer.prototype.drawDandelion = function() {
	this.drawOptiText("DANDELION", this.width / 2, -2);
	this.drawOptiText("CHOCOLATE", this.width / 2, this.height - 24);
	this.drawGothicText("SMALL-BATCH", this.width / 2, this.height / 2 - 5)
}

module.exports = CanvasRenderer;
