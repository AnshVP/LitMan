const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    default: "General",
  },
  location: {
    lat: {
      type: Number,
      default: 0,
      required: true,
    },
    lon: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  profilePic: { type: String },
  role: {type: String, default: "resident"},
  status: {type: String}
});

const User = mongoose.model("user", UserSchema);
User.createIndexes();
module.exports = User;
