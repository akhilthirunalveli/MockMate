const User = require("../models/User");
const Session = require("../models/Session");
const Question = require("../models/Question");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, profileImageUrl } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImageUrl,
    });

    // Return user data with JWT
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login request:", { email, password }); // Add this line

    const user = await User.findOne({ email }).select("+password name email profileImageUrl").lean();
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    delete user.password;

    res.json({
      ...user,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login error:", error); // Add this for debugging
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private (Requires JWT)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Login/Register user with Firebase OAuth
// @route   POST /api/auth/firebase-login
// @access  Public
const firebaseLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: "No Firebase ID token provided" });
    }

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, picture, uid } = decodedToken;

    if (!email) {
      return res.status(400).json({ message: "No email found in Firebase token" });
    }

    // Try to find user in DB
    let user = await User.findOne({ email });

    // If user doesn't exist, create one
    if (!user) {
      user = await User.create({
        name: name || "Firebase User",
        email,
        password: uid, // Store UID as password hash placeholder (not used)
        profileImageUrl: picture || null,
      });
    } else {
      // Always update profileImageUrl if changed (for returning users)
      if (picture && user.profileImageUrl !== picture) {
        user.profileImageUrl = picture;
        await user.save();
      }
    }

    // Return user data with JWT
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(401).json({ message: "Firebase authentication failed", error: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Public
const getAllUsers = async (req, res) => {
  try {
    // Remove password from results
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/auth/users/:id
// @access  Public (Admin)
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("Attempting to delete user with ID:", userId);

    // Check if user exists
    const user = await User.findById(userId);
    
    if (!user) {
      console.log("User not found:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Found user to delete:", user.name, user.email);

    // Find all sessions belonging to this user
    const userSessions = await Session.find({ user: userId });
    console.log("Found sessions to delete:", userSessions.length);

    // Delete all questions associated with the user's sessions
    for (const session of userSessions) {
      await Question.deleteMany({ session: session._id });
    }

    // Delete all sessions belonging to this user
    await Session.deleteMany({ user: userId });

    // Finally, delete the user
    await User.findByIdAndDelete(userId);

    console.log("Successfully deleted user and related data");
    res.status(200).json({ message: "User and all related data deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ 
      message: "Failed to delete user", 
      error: error.message,
      details: error.toString()
    });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, firebaseLogin, getAllUsers, deleteUser };