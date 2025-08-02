const express = require("express");
const passport = require("passport");
const {
  registerUser,
  loginUser,
  getUserProfile,
  firebaseLogin,
  getAllUsers,
  deleteUser, // Added this function
  updateResumeLink,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Auth Routes
router.post("/register", registerUser); // Register User
router.post("/login", loginUser); // Login User
router.get("/profile", protect, getUserProfile); // Get User Profile
router.put("/resume-link", protect, updateResumeLink); // Update Resume Link
router.get("/users", getAllUsers); // Get all users
router.delete("/users/:id", deleteUser); // Delete User// Firebase OAuth login
router.post("/firebase-login", firebaseLogin);

// Start Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/dashboard", // or wherever you want
    failureRedirect: "/login",
  })
);

module.exports = router;