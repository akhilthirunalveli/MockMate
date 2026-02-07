const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const { protect } = require("../middlewares/authMiddleware");

// GET /api/notifications - Get all notifications for the logged-in user
router.get("/", protect, async (req, res) => {
    try {
        console.log(`[NOTIFICATIONS] Fetching for user: ${req.user._id}`);
        const notifications = await Notification.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50); // Limit to last 50
        console.log(`[NOTIFICATIONS] Found ${notifications.length} notifications.`);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications" });
    }
});

// PUT /api/notifications/:id/read - Mark notification as read
router.put("/:id/read", protect, async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        notification.isRead = true;
        await notification.save();
        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: "Error updating notification" });
    }
});

// PUT /api/notifications/read-all - Mark all as read
router.put("/read-all", protect, async (req, res) => {
    try {
        await Notification.updateMany(
            { userId: req.user._id, isRead: false },
            { $set: { isRead: true } }
        );
        res.json({ message: "All notifications marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Error updating notifications" });
    }
});

// DELETE /api/notifications/clear-all - Delete all notifications
router.delete("/clear-all", protect, async (req, res) => {
    try {
        await Notification.updateMany(
            { userId: req.user._id },
            { $set: { isRead: true, isDeleted: true } } // Soft delete or hard delete? The user said "remove all". Let's assume hard delete based on typical "clear" behavior, or actually `deleteMany`.
        );
        // Wait, the previous attempt used deleteMany. Let's stick to deleteMany as "Clear" usually implies removal.
        await Notification.deleteMany({ userId: req.user._id });
        res.json({ message: "All notifications cleared" });
    } catch (error) {
        res.status(500).json({ message: "Error clearing notifications" });
    }
});

module.exports = router;
