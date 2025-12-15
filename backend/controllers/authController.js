// @desc    Login/Register user via Google OAuth
// @route   POST /api/auth/google
// @access  Public
const googleAuthUser = async (req, res) => {
  try {
    const { email, name, profileImageUrl } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    let user = await User.findOne({ email });
    if (!user) {
      // Create new user with no password
      user = await User.create({
        name,
        email,
        profileImageUrl,
        initials: generateInitials(name),
      });
    }
    // Return user data with JWT
    res.status(200).json({
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
const User = require("../models/User");
const Session = require("../models/Session");
const Question = require("../models/Question");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Helper function to generate initials from full name
const generateInitials = (name) => {
  if (!name) return "U"; // Default fallback

  const words = name.trim().split(" ");
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  // Take first letter of first name and first letter of last name
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
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

    const user = await User.findOne({ email }).select('+password').lean();

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if user has a password (not OAuth user)
    if (!user.password) {
      return res.status(401).json({ message: "Please use Google login for this account" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    delete user.password;

    // Check if user has invalid profileImageUrl and generate proper initials
    if (!user.profileImageUrl || user.profileImageUrl === "Hi" || user.profileImageUrl.length < 1 || user.profileImageUrl.length > 3) {
      const newInitials = generateInitials(user.name);
      // Update the user in database with proper initials
      await User.findByIdAndUpdate(user._id, { profileImageUrl: newInitials });
      user.profileImageUrl = newInitials;
    }

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

    // Check if user has invalid profileImageUrl and generate proper initials
    if (!user.profileImageUrl || user.profileImageUrl === "Hi" || user.profileImageUrl.length < 1 || user.profileImageUrl.length > 3) {
      const newInitials = generateInitials(user.name);
      // Update the user in database with proper initials
      await User.findByIdAndUpdate(user._id, { profileImageUrl: newInitials });
      user.profileImageUrl = newInitials;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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
    const sessionIds = userSessions.map(session => session._id);

    console.log(`Found ${userSessions.length} sessions to delete for user ${userId}`);

    // Delete all questions associated with the user's sessions in parallel
    if (sessionIds.length > 0) {
      const deleteQuestionsResult = await Question.deleteMany({ session: { $in: sessionIds } });
      console.log(`Deleted ${deleteQuestionsResult.deletedCount} questions`);
    }

    // Delete all sessions belonging to this user
    const deleteSessionsResult = await Session.deleteMany({ user: userId });
    console.log(`Deleted ${deleteSessionsResult.deletedCount} sessions`);

    // Finally, delete the user
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      // Fallback in case findById check passed but delete failed (rare race condition)
      return res.status(404).json({ message: "User not found during deletion" });
    }

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

// @desc    Update user resume link
// @route   PUT /api/auth/resume-link
// @access  Private
const updateResumeLink = async (req, res) => {
  try {
    const { resumeLink } = req.body;
    const userId = req.user.id;

    // Update user's resume link
    const user = await User.findByIdAndUpdate(
      userId,
      { resumeLink },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Resume link updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        resumeLink: user.resumeLink,
      },
    });
  } catch (error) {
    console.error("Error updating resume link:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, getAllUsers, deleteUser, updateResumeLink, googleAuthUser };