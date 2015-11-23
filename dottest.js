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

var all_dark_01 = buildSolid(1, false);
var all_dark_02 = buildSolid(2, false);
var all_bright_01 = buildSolid(1, true);
var all_bright_02 = buildSolid(2, true);

var funpattern1 = buildFlippyDottys(1, false);
var funpattern1a = buildFlippyDottys(1, true);
var funpattern2 = buildFlippyDottys(2, true);
var funpattern2a = buildFlippyDottys(2, false);




var serialPort = new SerialPort("/dev/ttyAMA0", {
  baudrate: 57600
});

serialPort.on("open", function () {
  console.log('open');
  console.log(all_dark_01);

  serialPort.write(all_bright_01, function(err, results) {
	console.log("error writing.");
	console.log(err);
	console.log(results);
	serialPort.close();
  });
//  serialPort.write(all_bright_02);
});
