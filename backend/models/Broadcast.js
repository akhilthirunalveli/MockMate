const mongoose = require("mongoose");

const broadcastSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true
    },
    targetAudience: {
        type: String,
        enum: ["ALL", "SELECTED"],
        default: "ALL"
    },
    recipientCount: {
        type: Number,
        default: 0
    },
    sentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: { createdAt: true, updatedAt: false } }); // Only care about when it was sent

module.exports = mongoose.model("Broadcast", broadcastSchema);
