"use strict";

var FD = require("./flipdot");
var express = require("express");
var bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.json());
app.use("/static", express.static(__dirname + "/static"));

app.post("/text", function(req, res) {

    res.sendStatus(200);
});

app.post("/clear", function(req, res) {
	// flipdots.clear, add white/black
    res.sendStatus(200);
});

app.post("/testMode", function(req, res) {
	// blow away current queue and fire up the test mode
    res.sendStatus(200);
});

app.post("/addOrder", function(req, res) {

    res.sendStatus(200);
});

app.post("/clearOrder", function(req, res) {

    res.sendStatus(200);
});

app.post("/clearOrders", function(req, res) {

    res.sendStatus(200);
});

app.post("/nighttime", function(req, res) {
	// put up something to display overnight
    res.sendStatus(200);
});

app.listen(8080, function() {
	console.log("flipdot webserver listening on port 8080");
});

