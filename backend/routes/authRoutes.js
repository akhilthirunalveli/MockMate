const express = require("express");
const { registerUser, loginUser, getUserProfile, getAllUsers, deleteUser, updateResumeLink } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Auth Routes
router.post("/register", registerUser);   // Register User
router.post("/login", loginUser);         // Login User
router.get("/profile", protect, getUserProfile);  // Get User Profile
router.put("/resume-link", protect, updateResumeLink);  // Update Resume Link
router.get("/users", getAllUsers);       // Get All Users
router.delete("/users/:id", deleteUser); // Delete User

module.exports = router;
