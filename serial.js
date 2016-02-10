"use strict";

var SerialPort = require("serialport").SerialPort;

var serialPort = new SerialPort("/dev/ttyAMA0", {
 	baudrate: 57600
}, false);

serialPort.on("error", function(err) {
	throw err;
};

exports.open = function open(onOpen) {
	serialPort.open(function (err) {
		if (err) throw err;
		console.log("serial port open");
		onOpen();
	});
};

exports.write = function write(instruction) {
	serialPort.write(instruction);
};

exports.close = function close() {
	serialPort.close();
};
