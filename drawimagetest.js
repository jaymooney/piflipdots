"use strict";

var SerialPort = require("serialport").SerialPort
var FD = require("./flipdot");
var fs = require("fs");

var fdm = new FD.FlipdotManager(2, 2, 8);

var serialPort = new SerialPort("/dev/ttyAMA0", {
 	baudrate: 57600
});

serialPort.on("open", function () {
	console.log("serial port open");
	drawImage();
});

function drawImage() {
	fs.readFile("./dandelionfull.jpg", function(err, img) {
		if (err) throw err;
		fdm.drawCanvasImage(img);
		fdm.copyFromCanvas();
		var instruction = fdm.buildInstruction();
		if (instruction) {
			serialPort.write(instruction);
		}

		setTimeout(function() {
			fdm.invertAll();
			serialPort.write(fdm.buildInstruction());
		}, 1000);

	});
}

function drawText() {
	if (err) throw err;
	fdm.drawCanvasText("DANDELION", 0, 0);
	fdm.drawCanvasText("CHOCOLATE", 0, 14);
	fdm.copyFromCanvas();
	var instruction = fdm.buildInstruction();
	if (instruction) {
		serialPort.write(instruction);
	}

	setTimeout(function() {
		fdm.invertAll();
		serialPort.write(fdm.buildInstruction());
	}, 1000);

}
