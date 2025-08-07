import React, { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LandingPage from "./pages/LandingPage";
import UserProvider from "./context/userContext";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import SpinnerLoader from "./components/Loader/SpinnerLoader";

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

// Lazy load heavy components with better error handling
const Dashboard = React.lazy(() => 
  import("./pages/Home/Dashboard").catch(error => {
    console.error('Failed to load Dashboard:', error);
    return { default: () => <div>Error loading Dashboard</div> };
  })
);

const InterviewPrep = React.lazy(() => 
  import("./pages/InterviewPrep/InterviewPrep").catch(error => {
    console.error('Failed to load InterviewPrep:', error);
    return { default: () => <div>Error loading Interview Prep</div> };
  })
);

const Record = React.lazy(() => 
  import("./pages/InterviewPrep/Record").catch(error => {
    console.error('Failed to load Record:', error);
    return { default: () => <div>Error loading Record</div> };
  })
);

const Admin = React.lazy(() => 
  import("./pages/admin").catch(error => {
    console.error('Failed to load Admin component:', error);
    return {
      default: () => (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
          color: "white",
          fontFamily: "system-ui"
        }}>
          <div style={{ textAlign: "center" }}>
            <h2>Error Loading Admin Panel</h2>
            <p>Please refresh the page and try again.</p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "10px"
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    };
  })
);

const App = () => {
  return (
    <ErrorBoundary>
      <UserProvider>
        <div>
          <Router>
            <ErrorBoundary>
              <Suspense fallback={<SpinnerLoader transparent />}>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/interview-prep/:sessionId" element={<InterviewPrep />}/>
                  <Route path="/interview-prep/record" element={<Record />}/>
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </Router>

          <PWAInstallPrompt />

          <Toaster
            toastOptions={{
              className: "",
              style: {
                fontSize: "13px",
              },
            }}
          />
        </div>
        <Analytics/>
      </UserProvider>
    </ErrorBoundary>
  );
};

export default App;
