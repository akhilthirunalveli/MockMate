const express = require("express");
const { getChatHistory, chatWithCoach, resetChatHistory } = require("../controllers/coachMateController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/history", protect, getChatHistory);
router.post("/chat", protect, chatWithCoach);
router.delete("/history", protect, resetChatHistory);

module.exports = router;
