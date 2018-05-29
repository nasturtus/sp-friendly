const express = require("express");
const mongoose = require("mongoose");

const manageFriendsRouter = express.Router();
const Friend = require("../model/friend");

const checkUserExists = async user => {
  // returns null if user does not exist or the document
  return await Friend.findOne({ user: user });
};

const handleError = (res, error) => {
  console.log("in handleError");
  res.status(501).json({
    success: "false",
    message: error.message
  });
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
  const result1 = await checkUserExists(user1);
  console.log(result1);
  const result2 = await checkUserExists(user2);
  console.log(result2);

  // if either of the users doesn't exist or if one has blocked the other, then throw error
  // if they are already friends then return appropriate message

  if (!result1 || !result2) {
    return "No such user.";
  } else if (
    result1.blocked.includes(user2) ||
    result2.blocked.includes(user1)
  ) {
    return "Cannot add as friends: blocked.";
  } else if (result1.friends.includes(user2)) {
    return "Redundant: they are already friends.";
  }

  // if not friends then go ahead with adding

  if (!result1.friends.includes(user2)) {
    result1.friends.push(user2);
    updateFriendsList(result1);

    result2.friends.push(user1);
    updateFriendsList(result2);
    return "Success";
  }
};

manageFriendsRouter.post("/addfriends", async (req, res) => {
  const user1 = req.body.friends[0];
  const user2 = req.body.friends[1];

  const status = await addFriends(user1, user2);
  if (
    status === "No such user." ||
    status === "Cannot add as friends: blocked." ||
    status === "Redundant: they are already friends."
  ) {
    handleError(res, new Error(status));
  } else {
    res.status(200).json({
      success: "true"
    });
  }
});

manageFriendsRouter.get("/getfriends", async (req, res) => {
  try {
    const result = await Friend.findOne({ user: req.body.email });
    if (result) {
      res.status(200).json({
        success: "true",
        friends: result.friends,
        count: result.friends.length
      });
    } else {
      throw new Error("No such user.");
    }
  } catch (error) {
    handleError(res, error);
  }
});

manageFriendsRouter.get("/getcommonfriends", async (req, res) => {
  try {
    const result1 = await checkUserExists(req.body.friends[0]);
    console.log(result1);
    const result2 = await checkUserExists(req.body.friends[1]);
    console.log(result2);

    // if either of the users doesn't exist, throw error

    if (!result1 || !result2) {
      throw new Error("No such user.");
    }
    const commonFriends = result1.friends.filter(friend => {
      return result2.friends.includes(friend);
    });
    res.status(200).json({
      success: true,
      friends: commonFriends,
      count: commonFriends.length
    });
  } catch (error) {
    handleError(res, error);
  }
});

manageFriendsRouter.post("/subscribe", async (req, res) => {
  try {
    const requestor = await checkUserExists(req.body.requestor);
    console.log(requestor);
    const target = await checkUserExists(req.body.target);
    console.log(target);

    // if either of the users doesn't exist, or if either has blocked the other,
    // or if requestor has already subscribed to target
    // then throw error
    // else go ahead with adding target to requestor's subscribedTo list

    if (!requestor || !target) {
      throw new Error("No such user.");
    } else if (
      target.blocked.includes(requestor.user) ||
      requestor.blocked.includes(target.user)
    ) {
      throw new Error(
        `Cannot subscribe to update: either requestor or target is blocked.`
      );
    } else if (requestor.subscribedTo.includes(target.user)) {
      throw new Error(
        `Redundant: ${requestor.user} is already subscribed to ${target.user}.`
      );
    } else {
      requestor.subscribedTo.push(target.user);
      const updatedResult = await Friend.findByIdAndUpdate(
        requestor._id,
        {
          subscribedTo: requestor.subscribedTo
        },
        { new: true }
      );
      console.log(
        `Updated result after adding to ${requestor.user}'s subscriber list:`
      );
      console.log(updatedResult);

      res.status(200).json({
        success: true
      });
    }
  } catch (error) {
    handleError(res, error);
  }
});

manageFriendsRouter.post("/block", async (req, res) => {
  try {
    const requestor = await checkUserExists(req.body.requestor);
    console.log(requestor);
    const target = await checkUserExists(req.body.target);
    console.log(target);

    // if either of the users does not exist or if requestor has already blocked target
    //  then throw error with appropriate message
    // else add target to requestor's blocked list

    if (!requestor || !target) {
      throw new Error("No such user.");
    } else if (requestor.blocked.includes(target.user)) {
      throw new Error(
        `Redundant: ${requestor.user} has already blocked ${target.user}.`
      );
    } else {
      requestor.blocked.push(target.user);
      const updatedResult = await Friend.findByIdAndUpdate(
        requestor._id,
        { blocked: requestor.blocked },
        { new: true }
      );
      res.status(200).json({
        success: "true"
      });
    }
  } catch (error) {
    handleError(res, error);
  }
});

manageFriendsRouter.get("/getrecipients", async (req, res) => {
  try {
    const sender = req.body.sender;
    const result = await checkUserExists(sender);
    if (!result) {
      throw new Error("No such user.");
    }

    // 1: extract all email mentions from text. result might be null if no match.
    // if null, assign [] to make it iterable.
    let emailMentions = req.body.text.match(/[a-z]+@[a-z]+.com/gi);
    if (!emailMentions) emailMentions = [];

    // 2: retrieve list of friends
    const sendersFriendsObj = await Friend.find(
      { user: sender },
      { _id: 0, friends: 1 }
    );
    sendersFriends = sendersFriendsObj[0].friends;

    // 3: retrieve all users where sender is listed in their subscribedTo
    const subscribersObj = await Friend.find(
      { subscribedTo: sender },
      { user: 1, _id: 0 }
    );
    const subscribers = subscribersObj.map(item => {
      return item.user;
    });

    // combine lists 1, 2, 3. result might contain duplicates.
    const aggregatedList = [
      ...emailMentions,
      ...sendersFriends,
      ...subscribers
    ];

    //  to remove duplicates
    const finalList = new Set(aggregatedList);

    res.json({ success: "true", recipients: Array.from(finalList) });
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = manageFriendsRouter;
