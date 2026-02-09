import React, { useState, useEffect, useRef } from "react";
import {
    Sent02Icon,
    AiCloudIcon,
    Add01Icon,
    Delete01Icon,
    Refresh01Icon,
    Cancel01Icon,
    Layout01Icon,
    File01Icon,
    ZapIcon
} from "hugeicons-react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../../utils/axiosInstance";
import AIResponsePreview from "../../Interview/Components/AIResponsePreview";
import SpinnerLoader from "../../Preparation/Loader/SpinnerLoader";
import { useNavigate } from "react-router-dom";

const SUGGESTIONS = [
    { text: "Mock Interview", icon: <Layout01Icon size={14} />, action: "I want to prepare for a mock interview. " },
    { text: "ATS Check", icon: <File01Icon size={14} />, action: "Can you help me with my resume ATS check?" },
    { text: "Job Hacks", icon: <ZapIcon size={14} />, action: "Tell me a quick placement/job life hack." },
];

const BackgroundAura = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Deep Indigo Flow - Top Left */}
        <motion.div
            className="absolute -top-32 -left-32 w-[450px] h-[450px] bg-indigo-500/[0.08] rounded-full blur-[130px]"
        />

        {/* Soft Amber Glow - Middle Right */}
        <motion.div
            className="absolute top-1/4 -right-24 w-[500px] h-[500px] bg-amber-500/[0.04] rounded-full blur-[150px]"
        />
    </div>
);

const CoachMateDrawer = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const chatEndRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            fetchHistory();
        }
    }, [isOpen]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchHistory = async () => {
        try {
            setInitialLoading(true);
            const response = await axiosInstance.get("/api/coach/history");
            if (response.data && response.data.messages) {
                setMessages(response.data.messages);
            }
        } catch (error) {
            console.error("Failed to fetch history:", error);
        } finally {
            setInitialLoading(false);
        }
    };

    const handleNewSession = async () => {
        if (loading) return;
        setMessages([]);
    };

    const handleResetChat = async () => {
        if (loading) return;
        if (!window.confirm("Action will delete all history. Continue?")) return;

        try {
            setLoading(true);
            await axiosInstance.delete("/api/coach/history");
            setMessages([]);
        } catch (error) {
            console.error("Reset failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        if (loading) return;
        fetchHistory();
    };

    const handleSend = async (forcedMessage = null) => {
        const textToSend = forcedMessage || input;
        if (!textToSend.trim() || loading) return;

        const userMsg = { role: "user", content: textToSend, timestamp: new Date() };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const response = await axiosInstance.post("/api/coach/chat", { message: textToSend });
            if (response.data && response.data.reply) {
                const aiMsg = { role: "model", content: response.data.reply, timestamp: new Date() };
                setMessages((prev) => [...prev, aiMsg]);
            }
        } catch (error) {
            console.error("CoachMate Error:", error);
            const errorMsg = { role: "model", content: "I encountered an error. Could you rephrase or try again?", timestamp: new Date() };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "tween", duration: 0.3 }}
                    className="fixed top-0 right-0 z-[100] h-screen p-0 overflow-hidden bg-black w-full md:w-[26vw] border-l border-white/5 flex flex-col font-display"
                >
                    <BackgroundAura />

                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 relative z-10">
                        <div className="flex items-center gap-3">
                            <div>
                                <h1 className="text-base font-bold text-white/90 tracking-tight">CoachMate</h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={handleNewSession} className="p-2 text-white/20 hover:text-white transition-colors cursor-pointer" title="New Session"><Add01Icon size={18} /></button>
                            <button onClick={handleResetChat} className="p-2 text-white/20 hover:text-red-500/80 transition-colors cursor-pointer" title="Clear History"><Delete01Icon size={18} /></button>
                            <button onClick={handleRefresh} className="p-2 text-white/20 hover:text-white transition-colors cursor-pointer" title="Refresh"><Refresh01Icon size={18} className={loading ? "animate-spin" : ""} /></button>
                            <div className="w-px h-4 bg-white/5 mx-1" />
                            <button onClick={onClose} className="p-2 text-white/20 hover:text-white transition-colors cursor-pointer"><Cancel01Icon size={20} /></button>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide flex flex-col gap-6 relative z-10">
                        {initialLoading ? (
                            <div className="flex-1 flex items-center justify-center">
                                <SpinnerLoader size={20} />
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center relative">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="flex flex-col items-center"
                                >
                                    <div className="mb-4 relative">
                                        <AiCloudIcon size={68} className="text-white relative z-10" strokeWidth={0.9} />
                                    </div>
                                    <h2 className="text-xl font-bold text-white mb-2">Hey, I'm CoachMate</h2>
                                    <p className="text-sm text-white/30 max-w-[200px] leading-relaxed mb-10 font-medium italic">Your personal AI career coach. How can I assist you today?</p>
                                </motion.div>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                                    >
                                        <div
                                            className={`max-w-[90%] px-3 py-2 text-[14px] leading-relaxed ${msg.role === "user"
                                                ? "bg-slate-900 text-white rounded-xl"
                                                : "bg-white/[0.05] border border-white/5 text-white/90 rounded-xl"
                                                }`}
                                        >
                                            {msg.role === "model" ? (
                                                <AIResponsePreview content={msg.content} />
                                            ) : (
                                                <p className="whitespace-pre-wrap">{msg.content}</p>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-white/10 mt-1.5 px-1">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                ))}
                                {loading && (
                                    <div className="flex items-center gap-2 text-white/20 text-[11px] font-bold tracking-tight py-2">
                                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                                        Thinking...
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 relative z-10">
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-3 px-1">
                            {SUGGESTIONS.map((s, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSend(s.action)}
                                    className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.03] border border-white/5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all cursor-pointer"
                                >
                                    <span className="opacity-40">{s.icon}</span>
                                    {s.text}
                                </button>
                            ))}
                        </div>
                        <div className="relative group">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                                placeholder="Message CoachMate..."
                                className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-all placeholder:text-white/10 pr-12"
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || loading}
                                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 text-white hover:text-white disabled:opacity-50 transition-colors cursor-pointer"
                            >
                                <Sent02Icon size={20} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CoachMateDrawer;





