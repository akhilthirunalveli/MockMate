import React, { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LandingPage from "./pages/LandingPage";
import UserProvider from "./context/userContext";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import SpinnerLoader from "./components/Loader/SpinnerLoader";

// Lazy load heavy components
const Dashboard = React.lazy(() => import("./pages/Home/Dashboard"));
const InterviewPrep = React.lazy(() => import("./pages/InterviewPrep/InterviewPrep"));
const Record = React.lazy(() => import("./pages/InterviewPrep/Record"));
const Admin = React.lazy(() => import("./pages/admin"));

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
