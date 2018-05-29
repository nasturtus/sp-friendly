const express = require("express");
const addUserRouter = express.Router();
const mongoose = require("mongoose");
const Friend = require("../model/friend");

addUserRouter.post("/", async (req, res) => {
  const result = await Friend.findOne({ user: req.body.user });
  console.log(result);
  if (!result) {
    // create new user and save to database
    const newUser = new Friend({
      user: req.body.user
    });
    const newUserResult = await newUser.save();
    console.log("new user created");
    console.log(newUserResult);
    res.status(201).json({
      success: "true",
      message: "new user created",
      details: {
        newUserResult
      }
    });
  } else {
    console.log("user already exists");
    res.status(200).json({
      message: "user already exists"
    });
  }
});

module.exports = addUserRouter;
