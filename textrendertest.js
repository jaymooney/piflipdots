"use strict";

var SerialPort = require("serialport").SerialPort
var FD = require("./flipdot");

var fdm = new FD.FlipdotManager(8, 2, 2);

var serialPort = new SerialPort("/dev/ttyAMA0", {
 	baudrate: 57600
});

serialPort.on("open", function () {
	console.log("serial port open");
	fdm.clearAll();
	serialPort.write(fdm.buildInstruction());
	setTimeout(drawText, 400);
	;
});

function drawText() {
	var line0 = "Hi Todd".toUpperCase();
	var line2 = "Merry".toUpperCase();
	var line3 = "Christmas".toUpperCase();
	fdm.drawNativeText(line0, 0);
	fdm.drawNativeText(line2, 2);
	fdm.drawNativeText(line3, 3);
	var instruction = fdm.buildInstruction();
	if (instruction) {
		serialPort.write(instruction);
	}

}