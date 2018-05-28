const express = require("express");
const friendsRouter = express.Router();

friendsRouter.post("/addfriend", (req, res) => {
  const friend1 = req.body.friends[0];
  const friend2 = req.body.friends[1];
  console.log({ friend1, friend2 });
});

module.exports = friendsRouter;
