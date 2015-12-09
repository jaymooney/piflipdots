var SerialPort = require("serialport").SerialPort

var dot0 = 1;
var dot1 = 2;
var dot2 = 4;
var dot3 = 8;
var dot4 = 16;
var dot5 = 32;
var dot6 = 64;

var all = 127;
var none = 0;
var testpattern1 = dot1 | dot3 | dot5;
var testpattern2 = ~testpattern1;
  
// dark / bright transmissions for configurations above

function buildSolid(address, meh) {
  var fun = [0x80, 0x83, address];
  for (var i = 0; i < 28; i++) {
    fun.push(meh ? all : none);
  }
  fun.push(0x8f);
  return fun;
}

function buildFlippyDottys(address, meh) {
  var fun = [0x80, 0x83, address];
  for (var i = 0; i < 28; i++) {
    fun.push((i % 2 == meh) ? testpattern1 : testpattern2);
  }
  fun.push(0x8f);
  return fun;
}

function buildInstruction(address, stuff) {
 return [0x80, 0x83, address].concat(stuff, 0x8f);
}

var all_dark_01 = buildSolid(0, false);
var all_dark_02 = buildSolid(2, false);
var all_bright_01 = buildSolid(0, true);
var all_bright_02 = buildSolid(2, true);

var funpattern1 = buildFlippyDottys(0, false);
var funpattern1a = buildFlippyDottys(0, true);
var funpattern2 = buildFlippyDottys(2, true);
var funpattern2a = buildFlippyDottys(2, false);

var testpattern1 = buildInstruction(0, [0, 56, 8, 120, 8, 8, 56, 0, 64, 32, 0, 0, 32, 64, 0, 0, 96, 0, 0, 32, 0, 0, 0, 32, 120, 32, 32, 0]);
var testpattern2 = buildInstruction(2, [0, 0, 4, 7, 4, 4, 0, 0, 3, 5, 5, 5, 5, 0, 0, 0, 4, 5, 5, 5, 2, 0, 0, 0, 7, 4, 4, 4]);

var serialPort = new SerialPort("/dev/ttyAMA0", {
  baudrate: 57600
});

serialPort.on("open", function () {
  console.log("open");

  var all = testpattern1.concat(testpattern2);
//  all = all_bright_02;
  serialPort.write(all, function(err, results) {
if (err) {
	console.log("error writing.");
	console.log(err);
} else {
	console.log(results);
	serialPort.drain(function(e, r) {
if (err) {
	console.log("error draining.");
	console.log(err);
}
	console.log(results);


	serialPort.close(function(err) {
		if (err) {
			console.log("error closing port");
			console.log(err);
		} else {
			console.log("done and done.");
		}
	});

	});
}
  });
});
