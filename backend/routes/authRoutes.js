const express = require("express");
const { registerUser, loginUser, getUserProfile, firebaseLogin } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Auth Routes
router.post("/register", registerUser);   // Register User
router.post("/login", loginUser);         // Login User
router.get("/profile", protect, getUserProfile);  // Get User Profile

// Firebase OAuth login
router.post("/firebase-login", async (req, res) => {
  const { idToken } = req.body;
  return firebaseLogin(req, res);
});


module.exports = router;
