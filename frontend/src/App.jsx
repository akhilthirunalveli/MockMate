import React from "react";
import { Analytics } from "@vercel/analytics/react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/Home/LandingPage.jsx";
import UserProvider from "./context/userContext.jsx";
import SpinnerLoader from "./pages/Preparation/Loader/SpinnerLoader.jsx";
import ResumeViewPage from "./pages/Resume/ResumeViewPage.jsx";
import ATSCheckerPage from "./pages/Resume/ATSCheckerPage.jsx";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
          color: "white",
          fontFamily: "system-ui",
          padding: "20px"
        }}>
          <div style={{ textAlign: "center", maxWidth: "500px" }}>
            <h2>Something went wrong</h2>
            <p style={{ marginBottom: "20px" }}>
              There was an error loading this page. Please try refreshing.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "12px 24px",
                backgroundColor: "#ffffffff",
                color: "black",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "16px"
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

import Dashboard from "./pages/Home/Dashboard.jsx";
import InterviewPrep from "./pages/Preparation/InterviewPrep.jsx";
import Record from "./pages/Interview/HRInterview/Record.jsx";
import Admin from "./pages/Admin/admin.jsx";
import SessionInterview from "./pages/Interview/SessionInterview/SessionInterview.jsx";
import LiveInterview from "./pages/Interview/LiveInterview/index.jsx";
import Docs from "./pages/Docs/Docs.jsx";

const App = () => {
  return (
    <ErrorBoundary>
      <UserProvider>
        <Router>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/interview-prep/:sessionId" element={<InterviewPrep />} />
              <Route path="/interview/hr/record" element={<Record />} />
              <Route path="/interview/session-interview" element={<SessionInterview />} />
              <Route path="/interview-prep/record" element={<Record />} />
              <Route path="/resume-view" element={<ResumeViewPage />} />
              <Route path="/resume/ats-check" element={<ATSCheckerPage />} />
              <Route path="/interview-prep/session-interview" element={<SessionInterview />} />
              <Route path="/interview/live" element={<LiveInterview />} />
            </Routes>
          </ErrorBoundary>

          <Toaster
            toastOptions={{
              className: "",
              style: {
                fontSize: "13px",
              },
            }}
          />
        </Router>
        <Analytics />
      </UserProvider>
    </ErrorBoundary>
  );
};

export default App;
