require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const admin = require("firebase-admin");

const authRoutes = require('./routes/auth');
const sessionRoutes = require('./routes/sessionRoutes')
const questionRoutes = require('./routes/questionRoutes');
const { protect } = require("./middlewares/authMiddleware");
const { generateInterviewQuestions, generateConceptExplanation } = require("./controllers/aiController");

const app = express();

// Construct service account object from environment variables
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Middleware to handle CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
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


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
