const mongoose = require("mongoose");

const toastSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        default: 0
    },
    delay: {
        type: Number,
        default: 0 // delay in ms from previous toast
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Toast", toastSchema);
