"use strict";

var SerialPort = require("serialport").SerialPort
var FD = require("./flipdot");

var fdm = new FD.FlipdotManager(2, 2, 8);

var serialPort = new SerialPort("/dev/ttyAMA0", {
 	baudrate: 57600
});

serialPort.on("open", function () {
	console.log("serial port open");
	fdm.clearAll(false);
	var instruction = fdm.buildInstruction();
	serialPort.write(instruction);
	setTimeout(drawText, 1000);
});

function drawText() {
	var line0 = "Hi Todd".toUpperCase();
	var line2 = "Merry".toUpperCase();
	var line3 = "Christmas".toUpperCase();
	fdm.drawNativeText(line0, 0);
	fdm.drawNativeText(line2, 2);
	fdm.drawNativeText(line3, 3);
	var instruction = fdm.buildInstruction();
	serialPort.write(instruction);

}
