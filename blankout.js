"use strict";

var SerialPort = require("serialport").SerialPort
var FD = require("./flipdot");

var fdm = new FD.FlipdotManager(4, 4, 0);
var serialPort = new SerialPort("/dev/ttyAMA0", {
  baudrate: 57600
});

serialPort.on("open", function () {
  console.log("open");
  
  fdm.clearAll(process.argv[2] === "white");
  var instr = fdm.buildInstruction();
  serialPort.write(instr, function(err) { serialPort.close()});
});
