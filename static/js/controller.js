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
		toWhite: $("#clearToWhite").val()
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
