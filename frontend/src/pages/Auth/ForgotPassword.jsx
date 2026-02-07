import React, { useState } from "react";
import { Cancel01Icon } from 'hugeicons-react';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../config/firebase";
import { BeatLoader } from 'react-spinners';
import Input from "../Home/Components/Input.jsx";
import { validateEmail } from "../Home/Utils/helper.js";

const ForgotPassword = ({ setCurrentPage, onClose, isDark = false }) => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            setLoading(false);
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("Password reset link sent! Check your email.");
        } catch (error) {
            console.error(error);
            if (error.code === 'auth/user-not-found') {
                setError("No account found with this email.");
            } else {
                setError("Failed to send reset email. Please try again.");
            }
        } finally {
            setLoading(false);
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
                <h3 className="text-lg font-semibold text-black">Reset Password</h3>
                <p className="text-xs text-slate-700 mt-[5px] mb-6">
                    Enter your email to receive a password reset link.
                </p>

                <form onSubmit={handleResetPassword}>
                    <Input
                        value={email}
                        onChange={({ target }) => setEmail(target.value)}
                        label="Email Address"
                        placeholder="Enter your email address"
                        type="text"
                    />

                    {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
                    {message && <p className="text-green-600 text-xs pb-2.5">{message}</p>}

                    <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
                        <div className="flex items-center justify-center h-6">
                            {loading ? (
                                <BeatLoader color="white" size={8} speedMultiplier={0.8} />
                            ) : (
                                "Send Reset Link"
                            )}
                        </div>
                    </button>

                    <p className="text-[13px] text-slate-800 mt-4 text-center">
                        Remember your password?{" "}
                        <button
                            type="button"
                            className="font-medium text-primary underline cursor-pointer"
                            onClick={() => setCurrentPage("login")}
                        >
                            Log In
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
