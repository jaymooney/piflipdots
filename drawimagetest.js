"use strict";

var FD = require("./flipdot");
var fs = require("fs");

var fdm = new FD.FlipdotManager(4, 4, 0);

setTimeout(drawText, 1000);

function drawImage() {
	fs.readFile("./images/dandelionfull.jpg", function(err, img) {
		if (err) throw err;
		fdm.drawCanvasImage(img);
		fdm.copyFromCanvas();
		fdm.renderDots();

		setTimeout(function() {
			fdm.invertAll();
			fdm.renderDots();
		}, 1000);
	});
}

function drawText() {
	fdm.drawCanvasText("DANDELION", 0, 0);
	fdm.drawCanvasText("CHOCOLATE", 0, 28);
	fdm.copyFromCanvas();
	fdm.renderDots();
	setTimeout(process.exit, 1000);
}
