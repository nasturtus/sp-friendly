const express = require("express");
const manageFriendsRouter = express.Router();
const mongoose = require("mongoose");

const Friend = require("../model/friend");

const addUser = async user => {
  const result = await Friend.findOne({ user: user });
  console.log(result);
  if (!result) {
    // create new user and save to database; else do nothing
    const newUser = new Friend({
      user: user
    });
    const newUserResult = await newUser.save();
    console.log("new user created");
    console.log(newUserResult);
  } else {
    console.log("user already exists");
  }
};

const addFriends = async (user1, user2) => {
  const result = await Friend.findOne({ user: user1 });
  console.log(result);
  if (!result.friends.includes(user2)) {
    result.friends.push(user2);
    console.log(result.friends);
  }
  const updatedResult = await Friend.findByIdAndUpdate(result._id, {
    friends: result.friends
  });
  console.log("Updated result:");

  console.log(updatedResult);
};

manageFriendsRouter.post("/", async (req, res) => {
  try {
    const user1 = req.body.friends[0];
    const user2 = req.body.friends[1];

    await addUser(user1);
    await addUser(user2);

    addFriends(user1, user2);
    res.status(200).json({
      success: "true"
    });
  } catch (error) {
    res.status(500).json({
      success: "false"
    });
  }
});

module.exports = manageFriendsRouter;
