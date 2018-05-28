const mongoose = require("mongoose");

// mongoose schema
const friendSchema = mongoose.Schema({
  user: String,
  friends: [String],
  blocked: [String],
  subcribedTo: [String]
});

// schema to model and export model
module.exports = mongoose.model(Friend, friendSchema);
