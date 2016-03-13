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
        success: function (response) {
            console.log("yay success");
        },
        error: onError
	});
});



function onError(response) {
	console.log("boo fail");
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
        success: function (response) {
            console.log("yay success");
        },
        error: onError
	});
});



$("#flashButton").on("click", function(e) {
	$.ajax({
		method: "POST",
		url: "/flash",
    	// data: JSON.stringify(data),
    	contentType: "application/json",
        success: function (response) {
            console.log("yay success");
        },
        error: onError
	});
});

$("#stageLeftButton").on("click", function(e) {
	$.ajax({
		method: "POST",
		url: "/stageleft",
    	// data: JSON.stringify(data),
    	contentType: "application/json",
        success: function (response) {
            console.log("yay success");
        },
        error: onError
	});
});


$("#fullText").on("input", function(e) {

// enforce max line length and max lines
});

