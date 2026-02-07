import React, { useContext, useState } from "react";
import { GoogleIcon, Cancel01Icon } from 'hugeicons-react';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../config/firebase";
import { BeatLoader, SyncLoader } from 'react-spinners';
import { useNavigate } from "react-router-dom";
import Input from "../Home/Components/Input.jsx";
import { validateEmail } from "../Home/Utils/helper.js";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../constants/apiPaths.js";
import { UserContext } from "../../context/userContext.jsx";



// Add isDark prop to component definition
const Login = ({ setCurrentPage, onClose, isDark = false }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Handle regular email/password login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setError("");

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

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoginLoading(false);
    }
  };


  // Handle Google login
  const handleGoogleLogin = async () => {
    setLoginLoading(true);
    setError("");
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Send user info to backend to create/find user
      const backendRes = await axiosInstance.post(API_PATHS.AUTH.GOOGLE, {
        email: user.email,
        name: user.displayName,
        profileImageUrl: user.photoURL,
      });
      const { token } = backendRes.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(backendRes.data);
        navigate("/dashboard");
      } else {
        setError("Google login failed. No token returned.");
      }
    } catch (error) {
      setError("Google login failed. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div
      className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center rounded-lg shadow relative"
      style={{
        background: "linear-gradient(120deg, #ff6a00, #ee0979, #00c3ff, rgb(0,74,25), rgb(0,98,80), #ff6a00)",
        backgroundSize: "300% 100%",
        animation: "gradientBG 8s ease-in-out infinite",
        boxShadow: "0 4px 32px 0 rgba(0,0,0,0.13)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Add close button */}
      <button
        type="button"
        className={`${isDark ? 'text-gray-300 hover:bg-white/10 hover:text-white' : 'text-gray-400 hover:bg-grey-100 hover:text-gray-900'
          } bg-transparent rounded-lg text-sm w-8 h-8 flex justify-center items-center absolute top-3.5 right-3.5 cursor-pointer transition-all duration-200 z-10`}
        onClick={onClose}
      >
        <Cancel01Icon size={14} />
      </button>

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

          <button type="submit" className="btn-primary w-full mt-2" disabled={loginLoading}>
            <div className="flex items-center justify-center h-6">
              {loginLoading ? (
                <BeatLoader color="white" size={8} speedMultiplier={0.8} />
              ) : (
                "Log In"
              )}
            </div>
          </button>

          {/* Divider with Or */}
          <div className="flex items-center my-2">
            <div className="flex-grow h-px bg-gray-200" />
            <span className="mx-2 text-gray-500 text-sm">or</span>
            <div className="flex-grow h-px bg-gray-200" />
          </div>

          {/* Google login button styled as screenshot */}
          <button
            type="button"
            className="btn-primary w-full mt-2"
            onClick={handleGoogleLogin}
            style={{ marginBottom: "8px" }}
          >
            <GoogleIcon className="mr-2" size={18} color="white" />
            Continue with Google
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
              className={`w-10 h-6 flex items-center bg-blue-200 rounded-full p-1 duration-300 ease-in-out ${email === "testemail@gmail.com" && password === "Test@123"
                ? "bg-blue-500"
                : "bg-blue-200"
                }`}
            >
              <span
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${email === "testemail@gmail.com" && password === "Test@123"
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
