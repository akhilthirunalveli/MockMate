require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require('./routes/authRoutes');
const sessionRoutes = require('./routes/sessionRoutes')
const questionRoutes = require('./routes/questionRoutes');
const { protect } = require("./middlewares/authMiddleware");
const { generateInterviewQuestions, generateConceptExplanation, analyzeTranscript, cleanupTranscript, generatePDFData } = require("./controllers/aiController");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
      "https://mockmateapp.vercel.app",
      "https://mockmate.vercel.app",
      /\.vercel\.app$/,
      /\.netlify\.app$/,
      /\.onrender\.com$/,
      /^http:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,5}$/
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware to handle CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
      "https://mockmateapp.vercel.app",
      "https://mockmate.vercel.app",
      /\.vercel\.app$/,
      /\.netlify\.app$/,
      /\.onrender\.com$/,
      /^http:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,5}$/
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

connectDB()

// Middleware
app.use(express.json()); // <-- This must be before your routes

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/questions', questionRoutes);

app.post("/api/ai/generate-questions", protect, generateInterviewQuestions);
app.post("/api/ai/generate-explanation", protect, generateConceptExplanation);
app.post("/api/ai/analyze-transcript", protect, analyzeTranscript);
app.post("/api/ai/cleanup-transcript", protect, cleanupTranscript);
app.post("/api/ai/generate-pdf-data", protect, generatePDFData);

// Health check endpoint for debugging
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    geminiKeyLength: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0,
    mongoUri: process.env.MONGO_URI ? "SET" : "MISSING",
    port: process.env.PORT || 5000
  });
});

// Test endpoint for AI setup
app.get("/test-ai", async (req, res) => {
  try {
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    res.json({
      status: "AI Setup OK",
      hasKey: !!process.env.GEMINI_API_KEY,
      keyLength: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0,
      modelName: "gemini-1.5-flash"
    });
  } catch (error) {
    res.status(500).json({
      status: "AI Setup Failed",
      error: error.message,
      stack: error.stack
    });
  }
});

// Socket.io Connection Handler
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Chat Events
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined chat room: ${data}`);
  });

  socket.on("send_message", (data) => {
    // Add socket.id as author if not present, or trust client?
    // Client sends author: "User" currently. We will fix client to send socket.id or handle it there.
    // For now, just relay.
    socket.to(data.room).emit("receive_message", data);
  });

  // WebRTC Video Events
  socket.on("join-room", ({ room }) => {
    socket.join(room);
    console.log(`User with ID: ${socket.id} joined video room: ${room}`);
    // Notify others that a user joined (triggers initiator)
    socket.to(room).emit("user-joined", socket.id);
  });

  socket.on("signal", (payload) => {
    // payload = { room, signal }
    const { room, signal } = payload;
    // If it's an offer, send as 'other-user' to the other peer
    // If it's an answer or candidate, send as 'signal'
    if (signal.type === 'offer') {
      socket.to(room).emit('other-user', { signal, id: socket.id });
    } else {
      socket.to(room).emit('signal', { signal, id: socket.id });
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
