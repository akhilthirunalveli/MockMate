import React from "react";
import { Analytics } from "@vercel/analytics/react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Home/Dashboard";
import InterviewPrep from "./pages/InterviewPrep/InterviewPrep";
import UserProvider from "./context/userContext";
import Record from "./pages/InterviewPrep/Record";
import Admin from "./pages/admin";
import PWAInstallPrompt from "./components/PWAInstallPrompt";




const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/interview-prep/:sessionId" element={<InterviewPrep />}/>
            <Route path="/interview-prep/record" element={<Record />}/>
          </Routes>
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
