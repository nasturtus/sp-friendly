const express = require("express");
const showAllRouter = express.Router();
const mongoose = require("mongoose");
const Friend = require("../model/friend");

showAllRouter.get("/", async (req, res) => {
  const results = await Friend.find();
  console.log(results);
  res.status(200).json({
    count: results.length,
    results: results.map(result => {
      return {
        _id: result._id,
        user: result.user,
        friends: result.friends,
        subscribedTo: result.subscribedTo,
        blocked: result.blocked
      };
    })
  });
});

module.exports = showAllRouter;
