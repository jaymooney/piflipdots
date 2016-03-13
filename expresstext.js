"use strict";

var FD = require("./flipdot");
var express = require("express");
var morgan = require("morgan")
var bodyParser = require("body-parser");

var fdm = new FD.FlipdotManager(4, 4, 0);

var app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/static"));

app.post("/text", function(req, res) {
    if (req.body.text) {
        var row = req.body.row ? req.body.row - 1 : 0;
        fdm.makeTrainTextInstruction(req.body.text, row);
        // fdm.drawNativeText(req.body.text, row);
        // fdm.renderDots();
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

app.post("/clear", function(req, res) {
    fdm.clearAll(req.body.toWhite);
    fdm.renderDots();
    res.sendStatus(200);
});

app.post("/flip", function(req, res) {
    var s = req.body.speed || 200;
    fdm.fastFlip(s);
    res.sendStatus(200);
});

app.post("/flash", function(req, res) {
    fdm.flashAll(); // speed, # of times
    res.sendStatus(200);
});

app.post("/stageleft", function(req, res) {

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

