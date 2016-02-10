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
        error: function (response) {
            console.log("boo fail");
        },
	});
});
