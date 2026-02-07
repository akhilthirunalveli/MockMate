const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    type: { type: String, default: "info" }, // info, warning, success
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
