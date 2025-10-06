const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
  password: { type: String },
    profileImageUrl: { type: String, default: null },
    resumeLink: { type: String, default: null },
    initials: { type: String }, // User initials for display
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
