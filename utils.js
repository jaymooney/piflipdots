"use strict";

var TextRenderer = require("./textrenderer.js");

module.exports = {
	alladdress : 0xff,
	allonbits : (new Array(28)).fill(127),
	alloffbits : (new Array(28)).fill(0),

	buildInstruction: function (address, stuff) {
		return [0x80, 0x83, address].concat(stuff, 0x8f);
	},

	allonInstruction: function (address) {
		return module.exports.buildInstruction(module.exports.allonbits);
	},

	textTest: function(text, address) {
		var data = TextRenderer.makeSentence(text);
		if (data.length > 28) {
			data.length = 28;
		}
		data.unshift(address);
		data.unshift(0x83);
		data.unshift(0x80);
		data.push(0x8f);
		return data.join(",");
	}
};
