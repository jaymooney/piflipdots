"use strict";

var FD = require("./flipdot");
var fs = require("fs");

var fdm = new FD.FlipdotManager(4, 4, 0);

setTimeout(drawImage, 1000);

function drawImage() {

    fdm.canvas.drawImage("./images/dandelionfull.jpg", false, (err) => {
		if (err) throw err;
        fdm.copyFromCanvas();
        fdm.renderDots();

		setTimeout(function() {
			fdm.invertAll();
			fdm.renderDots();
		}, 1000);
    });
}
