const app = require("./app");
const mongoose = require("mongoose");
const port = process.env.port || 3001;

// start server

app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});

// connnect to database

const uri = process.env.MONGODB_URI || "mongodb://localhost/sp-friendly-db";

mongoose.connect(uri, (err, res) => {
  if (err) {
    console.log("Could not connect to database.");
  } else {
    console.log("Database connected.");
  }
});
