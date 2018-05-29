const mongoose = require("mongoose");

// mongoose schema
const friendSchema = mongoose.Schema({
  user: String,
  friends: { type: [String], default: [] },
  blocked: { type: [String], default: [] },
  subscribedTo: { type: [String], default: [] }
});

// schema to model and export model
module.exports = mongoose.model("Friend", friendSchema);
