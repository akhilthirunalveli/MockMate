import React, { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LandingPage from "./pages/LandingPage";
import UserProvider from "./context/userContext";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import SpinnerLoader from "./components/Loader/SpinnerLoader";

// Lazy load heavy components with proper error boundaries
const Dashboard = React.lazy(() => import("./pages/Home/Dashboard"));
const InterviewPrep = React.lazy(() => import("./pages/InterviewPrep/InterviewPrep"));
const Record = React.lazy(() => import("./pages/InterviewPrep/Record"));
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
    <UserProvider>
      <div>
        <Router>
          <Suspense fallback={<SpinnerLoader transparent />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/interview-prep/:sessionId" element={<InterviewPrep />}/>
              <Route path="/interview-prep/record" element={<Record />}/>
            </Routes>
          </Suspense>
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
    
  );
};

export default App;
