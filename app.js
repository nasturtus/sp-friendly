const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");

// declare app as an instance of express
const app = express();

// declare middleware
const friendsRouter = require("./route/friends");
app.use("/", friendsRouter);

module.exports = app;
