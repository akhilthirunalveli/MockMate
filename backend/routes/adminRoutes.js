const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Session = require("../models/Session");
const Question = require("../models/Question");

// Middleware to check admin code (can be replaced with JWT later)
// For now, we trust the frontend to send a valid request if they have the code
// Ideally, you should have a middleware here.

// GET /analytics
router.get("/analytics", async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalSessions = await Session.countDocuments();
        const totalQuestions = await Question.countDocuments();

        // Popular Topics (Simple aggregation from Sessions)
        const popularTopics = await Session.aggregate([
            { $group: { _id: "$topicsToFocus", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Completion Rate (Sessions with endTime vs Total Sessions)
        const completedSessions = await Session.countDocuments({ endTime: { $exists: true, $ne: null } });
        const completionRate = totalSessions > 0 ? ((completedSessions / totalSessions) * 100).toFixed(1) : 0;

        // Users Joined last 30 days for retention graph
        const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));
        const newUsers = await User.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            totalUsers,
            totalSessions,
            totalQuestions,
            popularTopics,
            completionRate,
            newUsers
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /users/:id/ban
router.post("/users/:id/ban", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.isBanned = !user.isBanned;
        await user.save();
        res.json({ message: `User ${user.isBanned ? "banned" : "unbanned"} successfully`, isBanned: user.isBanned });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /broadcast
router.post("/broadcast", async (req, res) => {
    const { subject, message, targetUserIds } = req.body;

    if (!subject || !message) {
        return res.status(400).json({ message: "Subject and message are required" });
    }

    try {
        let usersToNotify;
        const Notification = require("../models/Notification"); // Lazy load
        const Broadcast = require("../models/Broadcast"); // Lazy load

        if (targetUserIds && targetUserIds.length > 0) {
            // Send to specific users
            usersToNotify = await User.find({ _id: { $in: targetUserIds } }).select("_id");
        } else {
            // Send to ALL users
            usersToNotify = await User.find({}).select("_id");
        }

        if (usersToNotify.length === 0) {
            return res.status(404).json({ message: "No users found to broadcast to." });
        }

        console.log(`[BROADCAST] Target User IDs:`, targetUserIds);
        console.log(`[BROADCAST] Found ${usersToNotify.length} users to notify.`);

        // Create notifications in bulk
        const notifications = usersToNotify.map(user => ({
            userId: user._id,
            title: subject,
            message: message,
            type: "info"
        }));

        await Notification.insertMany(notifications);

        // Save Broadcast History
        const newBroadcast = new Broadcast({
            subject,
            message,
            targetAudience: (targetUserIds && targetUserIds.length > 0) ? "SELECTED" : "ALL",
            recipientCount: usersToNotify.length,
            // sentBy: req.user._id // TODO: Add this when we have admin auth context fully wired
        });
        await newBroadcast.save();

        console.log(`[BROADCAST] Successfully inserted ${notifications.length} notifications and saved broadcast record.`);
        res.json({ message: `Broadcast sent successfully to ${notifications.length} users.` });

    } catch (error) {
        console.error("Broadcast error:", error);
        res.status(500).json({ message: "Failed to send broadcast" });
    }
});

// GET /broadcasts (History)
router.get("/broadcasts", async (req, res) => {
    try {
        const Broadcast = require("../models/Broadcast");
        const broadcasts = await Broadcast.find()
            .sort({ createdAt: -1 })
            .limit(50); // Limit to last 50 for performance
        res.json(broadcasts);
    } catch (error) {
        console.error("Fetch broadcasts error:", error);
        res.status(500).json({ message: "Failed to fetch broadcast history" });
    }
});



module.exports = router;
