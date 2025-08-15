import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
// Add Firebase imports at the top
import { signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../utils/firebase";

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  // Add loading state for Google login
  const [googleLoading, setGoogleLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  // Handle redirect result from Google login (fallback method)
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        console.log("🔄 Checking for redirect result...");
        const result = await getRedirectResult(auth);
        
        if (result) {
          console.log("✅ Redirect result found:", result.user.email);
          setGoogleLoading(true);
          
          const user = result.user;
          const idToken = await user.getIdToken();
          console.log("🔑 Got ID token from redirect, sending to backend...");
          
          const response = await axiosInstance.post(API_PATHS.AUTH.FIREBASE_LOGIN, { idToken });
          console.log("✅ Backend responded to redirect:", response.data);
          
          const { token, ...userInfo } = response.data;
          if (token) {
            localStorage.setItem("token", token);
            updateUser(userInfo);
            console.log("🎉 Redirect login successful! Navigating to dashboard...");
            navigate("/dashboard");
          }
        }
      } catch (error) {
        console.error("❌ Redirect result error:", error);
        setError(`Login failed: ${error.response?.data?.message || error.message}`);
      } finally {
        setGoogleLoading(false);
      }
    };

    handleRedirectResult();
  }, [navigate, updateUser]);

  // Listen for auth state changes (catches both popup and redirect results)
  useEffect(() => {
    console.log("📡 Setting up auth state listener...");
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("🔄 Auth state changed:", user ? `User: ${user.email}` : "No user");
      
      if (user && !localStorage.getItem("token") && googleLoading) {
        console.log("✅ User authenticated! Processing...");
        
        try {
          const idToken = await user.getIdToken();
          console.log("🔑 Got ID token from auth state change, sending to backend...");
          
          const response = await axiosInstance.post(API_PATHS.AUTH.FIREBASE_LOGIN, { idToken });
          console.log("✅ Backend responded to auth state change:", response.data);
          
          const { token, ...userInfo } = response.data;
          if (token) {
            localStorage.setItem("token", token);
            updateUser(userInfo);
            console.log("🎉 Auth state login successful! Navigating to dashboard...");
            navigate("/dashboard");
          }
        } catch (error) {
          console.error("❌ Auth state change error:", error);
          setError(`Login failed: ${error.response?.data?.message || error.message}`);
        } finally {
          setGoogleLoading(false);
        }
      }
    });

    return () => {
      console.log("🧹 Cleaning up auth state listener");
      unsubscribe();
    };
  }, [navigate, updateUser, googleLoading]);

  // Handle Login Form Submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setLoginLoading(false);
      return;
    }

    if (!password) {
      setError("Please enter the password");
      setLoginLoading(false);
      return;
    }

    setError("");

    //Login API Call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        // Use navigate instead of window.location.href for SPA speed
        navigate("/dashboard");
      }
      setLoginLoading(false);
    } catch (error) {
      // Log error for debugging
      console.error("Login error:", error);

      // Improved error handling for status 500
      if (error.response && error.response.status === 500) {
        setError("Server error (500). Please try again later or contact support.");
      } else if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError("Server error. Please try again later.");
      }
      setLoginLoading(false);
    }
  };

  // Add Google login handler with fallback to redirect
  const handleGoogleLogin = async () => {
    console.log("🔥 Starting Google login...");
    setGoogleLoading(true);
    setError("");
    
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      console.log("📱 Trying popup method first...");
      
      try {
        // Try popup first
        const result = await signInWithPopup(auth, provider);
        
        console.log("✅ Popup login successful!");
        const user = result.user;
        console.log("User:", user.displayName, user.email);
        
        const idToken = await user.getIdToken();
        console.log("🔑 Got ID token, sending to backend...");
        
        const response = await axiosInstance.post(API_PATHS.AUTH.FIREBASE_LOGIN, { idToken });
        console.log("✅ Backend responded:", response.data);
        
        const { token, ...userInfo } = response.data;
        if (token) {
          localStorage.setItem("token", token);
          updateUser(userInfo);
          console.log("🎉 Login successful! Navigating to dashboard...");
          navigate("/dashboard");
        } else {
          throw new Error("No token received from backend");
        }
        
      } catch (popupError) {
        console.log("❌ Popup failed, trying redirect method:", popupError.code);
        
        // If popup fails, use redirect method
        if (popupError.code === 'auth/popup-closed-by-user' || 
            popupError.code === 'auth/popup-blocked' ||
            popupError.code === 'auth/cancelled-popup-request') {
          
          console.log("🔄 Using redirect method...");
          await signInWithRedirect(auth, provider);
          // Don't set loading to false here - redirect will handle it
          return;
        } else {
          // Re-throw other errors
          throw popupError;
        }
      }
      
    } catch (error) {
      console.error("❌ Google login failed:", error);
      
      // Handle specific errors
      if (error.code === 'auth/popup-closed-by-user') {
        setError("Google login was cancelled. Please try again.");
      } else if (error.code === 'auth/popup-blocked') {
        setError("Popup was blocked. Trying redirect method...");
        // Try redirect as fallback
        try {
          const provider = new GoogleAuthProvider();
          await signInWithRedirect(auth, provider);
          return;
        } catch (redirectError) {
          setError("Login failed. Please enable popups or try again.");
        }
      } else if (error.response && error.response.status === 404) {
        setError("Google login is not available. Please ask the admin to enable /api/auth/firebase-login on the backend.");
      } else if (error.response && error.response.data && error.response.data.message) {
        setError(`Login error: ${error.response.data.message}`);
      } else if (error.message) {
        setError(`Login failed: ${error.message}`);
      } else {
        setError("Google login failed. Please try again.");
      }
      
      setGoogleLoading(false);
    }
  };

  return (
    <div
      className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center rounded-lg shadow"
      style={{
        background: "linear-gradient(120deg, #ff6a00, #ee0979, #00c3ff, rgb(0,74,25), rgb(0,98,80), #ff6a00)",
        backgroundSize: "300% 100%",
        animation: "gradientBG 8s ease-in-out infinite",
        boxShadow: "0 4px 32px 0 rgba(0,0,0,0.13)",
        position: "relative",
        overflow: "hidden",
      }}
    >

      <style>
        {`
          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
      <div style={{
        background: "rgba(255,255,255,0.90)",
        borderRadius: "inherit",
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none"
      }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <h3 className="text-lg font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please enter your details to log in
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="Enter your email address"
            type="text"
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min 8 Characters"
            type="password"
          />

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="btn-primary" disabled={loginLoading || googleLoading}>
            {loginLoading ? "Logging in..." : "LOGIN"}
          </button>

          {/* Login with Google button */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 mt-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition font-medium text-gray-700 shadow-sm cursor-pointer"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
          >
            <svg width="20" height="20" viewBox="0 0 48 48" className="mr-2" style={{ display: "inline" }}>
              <g>
                <path fill="#4285F4" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.3-5.7 7.5-10.3 7.5-6.1 0-11-4.9-11-11s4.9-11 11-11c2.6 0 5 .9 6.9 2.4l6.1-6.1C36.1 7.6 30.4 5 24 5 12.9 5 4 13.9 4 25s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.3-4z"/>
                <path fill="#34A853" d="M6.3 14.1l6.6 4.8C14.5 16.1 18.9 13 24 13c2.6 0 5 .9 6.9 2.4l6.1-6.1C36.1 7.6 30.4 5 24 5c-7.1 0-13.1 4.1-16.3 9.1z"/>
                <path fill="#FBBC05" d="M24 44c6.1 0 11.2-2 14.9-5.4l-6.9-5.7c-2 1.4-4.6 2.3-8 2.3-4.6 0-8.7-3.2-10.3-7.5l-6.6 5.1C10.9 40.1 17.1 44 24 44z"/>
                <path fill="#EA4335" d="M43.6 20.5h-1.9V20H24v8h11.3c-0.7 2-2.1 3.8-4.1 5.1l6.9 5.7C41.9 37.1 44 31.9 44 25c0-1.3-.1-2.7-.4-4.5z"/>
              </g>
            </svg>
            {googleLoading ? "Logging in..." : "Login with Google"}
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account?{" "}
            <button
              className="font-medium text-primary underline cursor-pointer"
              onClick={() => {
                setCurrentPage("signup");
              }}
            >
              SignUp
            </button>
          </p>
        </form>
          <div className="mt-3 flex items-center justify-center gap-3 w-full">
            <span
              className="font-medium text-sm bg-gradient-to-r from-amber-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
            >
              Wanna just explore MockMate. Use Demo Credentials
            </span>
            <label className="flex items-center cursor-pointer select-none">
              <input
            type="checkbox"
            checked={email === "testemail@gmail.com" && password === "Test@123"}
            onChange={e => {
              if (e.target.checked) {
                setEmail("testemail@gmail.com");
                setPassword("Test@123");
              } else {
                setEmail("");
                setPassword("");
              }
            }}
            className="sr-only"
              />
              <span
            className={`w-10 h-6 flex items-center bg-blue-200 rounded-full p-1 duration-300 ease-in-out ${
              email === "testemail@gmail.com" && password === "Test@123"
                ? "bg-blue-500"
                : "bg-blue-200"
            }`}
              >
            <span
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                email === "testemail@gmail.com" && password === "Test@123"
              ? "translate-x-4"
              : ""
              }`}
            />
              </span>
            </label>
          </div>
      </div>
    </div>
  );
};

export default Login;
