const express = require("express");
const mongoose = require("mongoose");

// declare app as an instance of express
const app = express();

// declare and use logger
const morgan = require("morgan");
app.use(morgan("dev"));

// declare and use body parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// declare middleware
const welcomeRouter = require("./route/welcome");
app.use("/", welcomeRouter);

const showAllRouter = require("./route/showAll");
app.use("/showall", showAllRouter);

const clearAllRouter = require("./route/clearAll");
app.use("/clearall", clearAllRouter);

const addUserRouter = require("./route/addUser");
app.use("/adduser", addUserRouter);

const manageFriendsRouter = require("./route/manageFriends");
app.use("/managefriends", manageFriendsRouter);

module.exports = app;
