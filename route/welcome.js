const express = require("express");

welcomeRouter = express.Router();

welcomeRouter.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Friendly",
    menuOptions: {
      "/showall": "GET: show all documents in collection",
      "/clearall": "POST: clears the collection of all documents",
      "/adduser": "POST: add a new user",
      "/managefriends/addfriends": "POST: add friends",
      "/managefriends/getfriends": "GET: get friends for a user",
      "/managefriends/getcommonfriends": "GET: get friends common to two users",
      "/managefriends/subscribe":
        "POST: subscribe to updates from another user",
      "/managefriends/block": "POST: block updates from another user",
      "/managefriends/getrecipients":
        "GET: get users who'll receive updates from sender"
    }
  });
});

module.exports = welcomeRouter;
