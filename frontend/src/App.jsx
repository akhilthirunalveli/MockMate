import React, { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LandingPage from "./pages/LandingPage/LandingPage";
import UserProvider from "./context/userContext";
import SpinnerLoader from "./components/Loader/SpinnerLoader";
import ResumeViewPage from "./pages/ResumeView/ResumeViewPage";

// Error Boundary Component
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
                backgroundColor: "#007bff",
                color: "white",
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

// Lazy load components with proper error boundaries
const Dashboard = React.lazy(() => 
  import("./pages/Home/Dashboard").catch(() => {
    return { default: () => <div style={{padding: "20px", textAlign: "center"}}>Error loading Dashboard</div> };
  })
);

const InterviewPrep = React.lazy(() => 
  import("./pages/InterviewPrep/InterviewPrep").catch(() => {
    return { default: () => <div style={{padding: "20px", textAlign: "center"}}>Error loading Interview Prep</div> };
  })
);

const Record = React.lazy(() => 
  import("./pages/InterviewPrep/Record").catch(() => {
    return { default: () => <div style={{padding: "20px", textAlign: "center"}}>Error loading Record</div> };
  })
);

const Admin = React.lazy(() => 
  import("./pages/admin").catch(() => {
    return { default: () => <div style={{padding: "20px", textAlign: "center"}}>Error loading Admin</div> };
  })
);

const App = () => {
  return (
    <ErrorBoundary>
      <UserProvider>
        <Router>
          <ErrorBoundary>
            <Suspense fallback={<SpinnerLoader transparent />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/interview-prep/:sessionId" element={<InterviewPrep />}/>
                <Route path="/interview-prep/record" element={<Record />}/>
                <Route path="/resume-view" element={<ResumeViewPage />} />
              </Routes>
            </Suspense>
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
        <Analytics/>
      </UserProvider>
    </ErrorBoundary>
  );
};

export default App;
