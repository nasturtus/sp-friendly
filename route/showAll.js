const express = require("express");
const showAllRouter = express.Router();
const mongoose = require("mongoose");
const Friend = require("../model/friend");

showAllRouter.get("/", async (req, res) => {
  const result = await Friend.find();
  res.status(200).json({
    count: result.length,
    result
  });
});

module.exports = showAllRouter;
