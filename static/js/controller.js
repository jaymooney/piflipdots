$("#writeText").on("click", function(e) {
	var data = {
		text: $("#textToWrite").val(),
		row: parseInt($("#rowToWrite").val())
	};
	$.ajax({
		method: "POST",
		url: "/text",
    	data: JSON.stringify(data),
    	contentType: "application/json",
        success: function (response) {
            console.log("yay success");
        },
        error: onError
	});

});


$("#clearButton").on("click", function(e) {
	var data = {
		toWhite: $("#clearToWhite").is(":checked")
	};
	$.ajax({
		method: "POST",
		url: "/clear",
    	data: JSON.stringify(data),
    	contentType: "application/json",
        success: onSuccess,
        error: onError
	});
});



function onError(response) {
	console.log("boo fail");
}
function onSuccess(response) {
    console.log("yay success");
}

$("#flipSpeed").on("input", function(e) {
	$("#currentSpeed").text(this.value);
});

$("#flipButton").on("click", function(e) {
	var data = {
		speed: parseInt($("#flipSpeed").val())
	};

	$.ajax({
		method: "POST",
		url: "/flip",
    	data: JSON.stringify(data),
    	contentType: "application/json",
        success: onSuccess,
        error: onError
	});
});



$("#flashButton").on("click", function(e) {
	$.ajax({
		method: "POST",
		url: "/flash",
    	// data: JSON.stringify(data),
    	contentType: "application/json",
        success: onSuccess,
        error: onError
	});
});

$("#stageLeftButton").on("click", function(e) {
	$.ajax({
		method: "POST",
		url: "/stageleft",
    	// data: JSON.stringify(data),
    	contentType: "application/json",
        success: onSuccess,
        error: onError
	});
});

$("#logoButton").on("click", function(e) {
	$.ajax({
		method: "POST",
		url: "/drawLogo",
    	contentType: "application/json",
        success: onSuccess,
        error: onError
	});
});

function truncateTextForSign(text) {
	var lines = text.split("\n"); 
	if (lines.length > 8) {
		lines.length = 8;
	}
	var truncated = lines.map(l => l.length > 18 ? l.substring(0, 18) : l);
	return truncated.join("\n");
}

$("#fullText").on("input", function(e) {
	var ss = this.selectionStart;
	var se = this.selectionEnd;
	this.value = truncateTextForSign(this.value);
	this.setSelectionRange(ss, se);
});

function writeTextToSign(text, animation) {
	$.ajax({
		method: "POST",
		url: "/fulltext",
		data: JSON.stringify({text:text,animation:animation}),
    	contentType: "application/json",
        success: onSuccess,
        error: onError
	});
}

$("#writeFullText").on("click", function(e) {
	writeTextToSign(truncateTextForSign($("#fullText").val()), "allflip");
});

var orderPreamble = ["   Orders ready:", " "];
var orders = [];

function makeOrderText() {
	var textOrders = orders.map(function(o, i) {
		var num = i + 1;
		return "  " + num + ") " + o;
	});
	return orderPreamble.concat(textOrders).join("\n");
}

$("#addOrder").on("click", function(e) {
	var name = $("#nameToAdd").val();
	if (name.length) {
		orders.push(name);
		writeTextToSign(makeOrderText(), "lineflip");
		$("#orderTable").append("<tr><td>" + name +
			"</td><td><span class=\"clearOrder glyphicon glyphicon-trash\"></span></td></tr>");
		$("#nameToAdd").val("");
	}
	// error
});

$(document).delegate("span.clearOrder", "click", function(e) {
	var rowToDelete = $(this).closest("tr");
	var index = rowToDelete.index();
	rowToDelete.fadeOut(600, function() {
		rowToDelete.remove();
	});
	orders.splice(index, 1);
	writeTextToSign(makeOrderText(), "lineflip");
});

$("#clearAllOrders").on("click", function(e) {
	$("#orderTable > tbody").empty();
	orders = [];
	writeTextToSign(makeOrderText(), "lineflip");
});
