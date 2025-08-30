import React, { useContext, useState } from "react";
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

          <button type="submit" className="btn-primary" disabled={loginLoading}>
            {loginLoading ? "Logging in..." : "LOGIN"}
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
