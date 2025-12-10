export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
    UPDATE_RESUME_LINK: "/api/auth/resume-link",
    GOOGLE: "/api/auth/google",
  },

  AI: {
    GENERATE_QUESTIONS: "/api/ai/generate-questions", // Generate interview questions and answers using Gemini
    GENERATE_EXPLANATION: "/api/ai/generate-explanation", // Generate concept explanation using Gemini
    ANALYZE_TRANSCRIPT: "/api/ai/analyze-transcript", // Analyze and refine interview transcript using Gemini
    CLEANUP_TRANSCRIPT: "/api/ai/cleanup-transcript", // Clean and improve transcript using Gemini
    GENERATE_PDF_DATA: "/api/ai/generate-pdf-data", // Generate structured data for PDF report
  },

  SESSION: {
    CREATE: "/api/sessions/create",
    GET_ALL: "/api/sessions/my-sessions",
    GET_ONE: (id) => `/api/sessions/${id}`,
    DELETE: (id) => `/api/sessions/${id}`,
  },

  QUESTION: {
    ADD_TO_SESSION: "/api/questions/add",
    PIN: (id) => `/api/questions/${id}/pin`,
    UPDATE_NOTE: (id) => `/api/questions/${id}/note`,
  },
};
