const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReportSchema = new Schema({
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  postedOn: { type: String },
  location: {
    type: {
      lat: { type: Number, default: 0 },
      lon: { type: Number, default: 0 }
    }
  },
  severity: { type: mongoose.Schema.Types.ObjectId, ref: "user"},
  description: {
    type: String,
    required: true
  },
  photos: { type: String }, // Array of photo URLs
  status: {
    type: String,
    default: "new",
    enum: ['new', 'assigned', 'cleaned'],
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      comment: { type: String },
    },
  ],
});
module.exports = mongoose.model("report", ReportSchema);
