const express = require("express");
const mongoose = require("mongoose");
const clearAllRouter = express.Router();
const Friend = require("../model/friend");

clearAllRouter.delete("/", (req, res) => {
  Friend.remove({}, () => {
    console.log("Database cleared");
    res.status(200).json({
      message: "Database cleared"
    });
  });
});

module.exports = clearAllRouter;
