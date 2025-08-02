import React from "react";
import { Analytics } from "@vercel/analytics/react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Admin from "./pages/admin";
import AdminPWAInstallPrompt from "./components/AdminPWAInstallPrompt";

const AdminApp = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Router>

      <AdminPWAInstallPrompt />

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
      <Analytics/>
    </div>
  );
};

export default AdminApp;
