import React, { useContext, useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../config/firebase";
import { SyncLoader} from 'react-spinners';
import { useNavigate } from "react-router-dom";
import Input from "../Home/Components/Input.jsx";
import { validateEmail } from "../Home/Utils/helper.js";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../constants/apiPaths.js";
import { UserContext } from "../../context/userContext.jsx";



const Login = ({ setCurrentPage }) => {
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

          <div className="flex flex-row gap-3 mt-2 w-full">
            <button type="submit" className="btn-primary w-1/2" disabled={loginLoading}>
              <div className="flex items-center justify-center h-6">
                {loginLoading ? (
                  <SyncLoader color="white" size={8} speedMultiplier={0.8} />
                ) : (
                  "LOGIN"
                )}
              </div>
            </button>
            <button
              type="button"
              className="btn-primary-google flex items-center justify-center bg-white text-slate-800 p-0 w-[45px] h-[45px] min-w-[45px] max-w-[45px] rounded-full"
              onClick={handleGoogleLogin}
            >
              <span className="w-5 h-5 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                </svg>
              </span>
            </button>
          </div>

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
