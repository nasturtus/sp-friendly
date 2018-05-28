const express = require("express");
const manageFriendsRouter = express.Router();
const mongoose = require("mongoose");

const Friend = require("../model/friend");

const addUser = async user => {
  console.log();
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

const updateFriendsList = async mainUser => {
  const updatedResult = await Friend.findByIdAndUpdate(
    mainUser._id,
    {
      friends: mainUser.friends
    },
    { new: true }
  );
  console.log(
    `Updated result after adding friend to ${mainUser.user}'s friends list:`
  );
  console.log(updatedResult);
};

const addFriends = async (user1, user2) => {
  console.log();
  const user1Result = await Friend.findOne({ user: user1 });
  console.log(user1Result);
  if (!user1Result.friends.includes(user2)) {
    user1Result.friends.push(user2);
    updateFriendsList(user1Result);

    const user2Result = await Friend.findOne({ user: user2 });
    user2Result.friends.push(user1);
    updateFriendsList(user2Result);
  }
};

manageFriendsRouter.post("/addfriends", async (req, res) => {
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
