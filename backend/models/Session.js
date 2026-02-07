const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  role: { type: String },
  experience: { type: String },
  topicsToFocus: { type: String },
  description: String,
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  endTime: { type: Date },
  isResumeSession: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Session", sessionSchema);
