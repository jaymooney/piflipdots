"use strict"

function* trainGenerator(start, end) {
	var current = start;
	while (current !== end) {
		for (var i = 0; i < current.length; i++) {
			if (current[i] !== end[i]) {
				var replacement;
				if (current[i] === " ") {
					if (end[i] > "Z" || end[i] < "A") {
						replacement = end[i];
					} else {
						replacement = "A";
					}
				} else if (current[i] >= "Z" || current[i] < "A") {
					replacement = " ";
				} else {
					replacement = String.fromCharCode(current.charCodeAt(i) + 1);
				}
				current = current.substr(0, i) + replacement + current.substr(i + 1);
			}
		};

		yield current;
	}
}

module.exports.makeTrainSignTransition = function(start, end, row, fdm) {
	return {
		speed: 100,
		done: false,
		gen: trainGenerator(start, end),
		nextInstruction: function() {
			let next = this.gen.next();
			if (next.done) {
				this.done = true;
				return;
			} else {
				fdm.drawNativeText(next.value, row);
				return fdm.buildInstruction();
			}
		}
	}
};

module.exports.makeFlipInstruction = function(speed, fdm) {
	let theAllController = fdm.allController;
	return {
		speed: speed,
		done: false,
		white: false,
		nextInstruction: function() {
			theAllController.clear(this.white);
			this.white = !this.white;
			var i = [];
			theAllController.writeDots(i);
			return i;
		}
	}
};

function* flashGenerator(numFlashes, fdm) {
	let original = fdm.controllers.map(col => col.map(controller => controller.cloneDots()));
	for (var i = 0; i < numFlashes; i++) {
		fdm.clearAll();
		yield fdm.buildInstruction();
		fdm.controllers.forEach((column, c) => column.forEach((controller, r) => controller.setDots(original[c][r])))
		yield fdm.buildInstruction();
	}
}

module.exports.makeFlashInstruction = function(speed, numFlashes, fdm) {
	return {
		speed: speed,
		done: false,
		gen: flashGenerator(numFlashes, fdm),
		nextInstruction: function() {
			let next = this.gen.next();
			this.done = next.done;
			return next.value;
		}
	}
};

