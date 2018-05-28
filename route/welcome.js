const express = require("express");

welcomeRouter = express.Router();

welcomeRouter.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Friendly"
  });
});

module.exports = welcomeRouter;
