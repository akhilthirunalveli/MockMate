const express = require("express");
const { registerUser, loginUser, getUserProfile, firebaseLogin, getAllUsers, deleteUser } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Auth Routes
router.post("/register", registerUser);   // Register User
router.post("/login", loginUser);         // Login User
router.get("/profile", protect, getUserProfile);  // Get User Profile
router.get("/users", getAllUsers);       // Get All Users
router.delete("/users/:id", deleteUser); // Delete User

// Firebase OAuth login
router.post("/firebase-login", async (req, res) => {
  const { idToken } = req.body;
  return firebaseLogin(req, res);
});


module.exports = router;
