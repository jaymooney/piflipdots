"use strict";

/**
 * characters are 5x7, usually the first and last row is blank for spacing
 */

var charWidth = 5;
var charHeight = 7; 
var blank = [0,0,0,0,0];

function createBitmap(pixelArray) {
	var hasFirstRow = pixelArray.length === charHeight;
	var hasLastRow = pixelArray.length > charHeight - 2;
	var ret = new Uint8ClampedArray(charWidth);
	var offset = hasFirstRow ? 0 : 1;
	var column = 0;

	var shift = pixelArray.length !== 7 ? 1 : 0;

	for (var i = 0; i < charWidth; i++) {
		var coldata = 0;


		for (var j = 0; j < pixelArray.length; j++) {
			if (pixelArray[j][i] === "0") {
				coldata |= 1 << (shift + j);
			}

		}
		ret[i] = coldata;
	}

	return ret;
}

module.exports.makeSentence = function makeSentence(str) {
	var sentence = [];
	var upper = str.toUpperCase();
	for (let ch of upper) {
		var bitmap = alphabet[ch];
		if (!bitmap) {
			bitmap = blank;
		}
		Array.prototype.push.apply(sentence, bitmap);
		sentence.push(0);
	}
	return sentence;
}

/**
 * the alphabet encoded in columns of bits, 5x5, except for Q which has one extra row for its tail
*/
var alphabet = module.exports.alphabet = {
	A: createBitmap([
		 " 000 ",
		 "0   0",
		 "00000",
		 "0   0",
		 "0   0"
	]),
	B: createBitmap([
		 "0000 ",
		 "0   0",
		 "00000",
		 "0   0",
		 "0000 "
	]),
	C: createBitmap([
		 " 0000",
		 "0    ",
		 "0    ",
		 "0    ",
		 " 0000"
	]),
	D: createBitmap([
		 "0000 ",
		 "0   0",
		 "0   0",
		 "0   0",
		 "0000 "
	]),
	E: createBitmap([
		 "00000",
		 "0    ",
		 "0000 ",
		 "0    ",
		 "00000"
	]),
	F: createBitmap([
		 "00000",
		 "0    ",
		 "00000",
		 "0    ",
		 "0    "
	]),
	G: createBitmap([
		 " 0000",
		 "0    ",
		 "0  00",
		 "0   0",
		 " 0000"
	]),
	H: createBitmap([
		 "0   0",
		 "0   0",
		 "00000",
		 "0   0",
		 "0   0"
	]),
	I: createBitmap([
		 "00000",
		 "  0  ",
		 "  0  ",
		 "  0  ",
		 "00000"
	]),
	J: createBitmap([
		 "00000",
		 "   0 ",
		 "   0 ",
		 "   0 ",
		 "000  "
	]),
	K: createBitmap([
		 "0   0",
		 "0  0 ",
		 "000  ",
		 "0  0 ",
		 "0   0"
	]),
	L: createBitmap([
		 "0    ",
		 "0    ",
		 "0    ",
		 "0    ",
		 "00000"
	]),
	M: createBitmap([
		 "0   0",
		 "00 00",
		 "0 0 0",
		 "0   0",
		 "0   0"
	]),
	N: createBitmap([
		 "0   0",
		 "00  0",
		 "0 0 0",
		 "0  00",
		 "0   0"
	]),
	O: createBitmap([
		 " 000 ",
		 "0   0",
		 "0   0",
		 "0   0",
		 " 000 "
	]),
	P: createBitmap([
		 "0000 ",
		 "0   0",
		 "0000 ",
		 "0    ",
		 "0    "
	]),
	Q: createBitmap([
		 " 000 ",
		 "0   0",
		 "0   0",
		 "0 0 0",
		 " 000 ",
		 "    0"
	]),
	R: createBitmap([
		 "0000",
		 "0   0",
		 "0000 ",
		 "0  0 ",
		 "0   0"
	]),
	S: createBitmap([
		 " 0000",
		 "0    ",
		 " 000 ",
		 "    0",
		 "0000 "
	]),
	T: createBitmap([
		 "00000",
		 "  0  ",
		 "  0  ",
		 "  0  ",
		 "  0  "
	]),
	U: createBitmap([
		 "0   0",
		 "0   0",
		 "0   0",
		 "0   0",
		 " 000 "
	]),
	V: createBitmap([
		 "0   0",
		 "0   0",
		 "0   0",
		 " 0 0 ",
		 "  0  "
	]),
	W: createBitmap([
		 "0   0",
		 "0   0",
		 "0 0 0",
		 "00 00",
		 "0   0"
	]),
	X: createBitmap([
		 "0   0",
		 " 0 0 ",
		 "  0  ",
		 " 0 0 ",
		 "0   0"
	]),
	Y: createBitmap([
		 "0   0",
		 "0   0",
		 " 0 0",
		 "  0  ",
		 "  0  "
	]),
	Z: createBitmap([
		 "00000",
		 "   0 ",
		 "  0  ",
		 " 0   ",
		 "00000"
	]),

	// NUMBERS

	"0": createBitmap([
		 " 000",
		 "0  00",
		 "0 0 0",
		 "00  0",
		 " 000 "
	]),
	"1": createBitmap([
		 "  0  ",
		 " 00  ",
		 "  0  ",
		 "  0  ",
		 " 000 "
	]),
	"2": createBitmap([
		 " 000 ",
		 "0   0",
		 "  00 ",
		 " 0   ",
		 "00000"
	]),
	"3": createBitmap([
		 " 000 ",
		 "0   0",
		 "  00 ",
		 "0   0",
		 " 000 "
	]),
	"4": createBitmap([
		 "    0",
		 "   00",
		 "  0 0",
		 " 0000",
		 "    0"
	]),
	"5": createBitmap([
		 "00000",
		 "0    ",
		 "0000 ",
		 "    0",
		 "0000 "
	]),
	"6": createBitmap([
		 " 000",
		 "0    ",
		 "0000 ",
		 "0   0",
		 " 000"
	]),
	"7": createBitmap([
		 "00000",
		 "    0",
		 "   0 ",
		 "  0  ",
		 " 0   "
	]),
	"8": createBitmap([
		 " 000 ",
		 "0   0",
		 " 000 ",
		 "0   0",
		 " 000 "
	]),
	"9": createBitmap([
		 " 000 ",
		 "0   0",
		 " 000 ",
		 "    0",
		 " 000 "
	]),

	// SYMBOLS

	"$": createBitmap([
		 "  0  ",
		 " 0000",
		 "0 0  ",
		 " 000 ",
		 "  0 0",
		 "0000 ",
		 "  0  "
	]),
	"#": createBitmap([
		 " 0 0 ",
		 "00000",
		 " 0 0 ",
		 "00000",
		 " 0 0 "
	]),
	"+": createBitmap([
		 "     ",
		 "  0  ",
		 " 000 ",
		 "  0  ",
		 "     "
	]),
	"*": createBitmap([
		 "  0 ",
		 "00000",
		 " 000 ",
		 "00000",
		 "  0 "
	]),
	":": createBitmap([
		 "     ",
		 "  0  ",
		 "     ",
		 "  0  ",
		 "     "
	]),
	".": createBitmap([
		 "     ",
		 "     ",
		 "     ",
		 "     ",
		 "  0  "
	]),
	",": createBitmap([
		 "     ",
		 "     ",
		 "     ",
		 "     ",
		 "  0  ",
		 " 0   "
	]),
	"!": createBitmap([
		 " 0   ",
		 " 0   ",
		 " 0   ",
		 "     ",
		 " 0   "
	]),
	"(": createBitmap([
		 "   0 ",
		 "  0  ",
		 "  0  ",
		 "  0  ",
		 "   0 "
	]),
	"(": createBitmap([
		 "  0  ",
		 "   0 ",
		 "   0 ",
		 "   0 ",
		 "  0  "
	]),
	"/": createBitmap([
		 "    0",
		 "   0 ",
		 "  0  ",
		 " 0   ",
		 "0    "
	]),
	" ": [0]
};
