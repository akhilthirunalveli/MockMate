export const BASE_URL = import.meta.env.VITE_BASE_URL || "https://mockmate-backend-r0jk.onrender.com";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register", // Signup
    LOGIN: "/api/auth/login", // Authenticate user & return JWT token
    FIREBASE_LOGIN: "/api/auth/firebase-login", // Firebase OAuth login
    GET_PROFILE: "/api/auth/profile", // Get logged-in user details
    UPDATE_RESUME_LINK: "/api/auth/resume-link", // Update resume link
  },

  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image", // Upload profile picture
  },

  AI: {
    GENERATE_QUESTIONS: "/api/ai/generate-questions", // Generate interview questions and answers using Gemini
    GENERATE_EXPLANATION: "/api/ai/generate-explanation", // Generate concept explanation using Gemini
    ANALYZE_TRANSCRIPT: "/api/ai/analyze-transcript", // Analyze and refine interview transcript using Gemini
    CLEANUP_TRANSCRIPT: "/api/ai/cleanup-transcript", // Clean and improve transcript using Gemini
    GENERATE_PDF_DATA: "/api/ai/generate-pdf-data", // Generate structured data for PDF report
  },

  SESSION: {
    CREATE: "/api/sessions/create", // Create a new interview session with questions
    GET_ALL: "/api/sessions/my-sessions", //  Get all user sessions
    GET_ONE: (id) => `/api/sessions/${id}`, // Get session details with questions
    DELETE: (id) => `/api/sessions/${id}`, // Delete a session
  },

  QUESTION: {
    ADD_TO_SESSION: "/api/questions/add", // Add more questions to a session
    PIN: (id) => `/api/questions/${id}/pin`, // Pin or Unpin a question
    UPDATE_NOTE: (id) => `/api/questions/${id}/note`, // Update/Add a note to a question
  },
};
