require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require('./routes/authRoutes');
const sessionRoutes = require('./routes/sessionRoutes')
const questionRoutes = require('./routes/questionRoutes');
const { protect } = require("./middlewares/authMiddleware");
const { generateInterviewQuestions, generateConceptExplanation, analyzeTranscript, cleanupTranscript, generatePDFData } = require("./controllers/aiController");

const app = express();

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
      /\.onrender\.com$/
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





// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
