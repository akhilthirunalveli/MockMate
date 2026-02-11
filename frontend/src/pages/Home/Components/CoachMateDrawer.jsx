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
    ZapIcon,
    Mic01Icon,
    VoiceIcon,
    ComputerIcon
} from "hugeicons-react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../../utils/axiosInstance";
import AIResponsePreview from "../../Interview/Components/AIResponsePreview";
import SpinnerLoader from "../../Preparation/Loader/SpinnerLoader";
import { useNavigate } from "react-router-dom";
import VoiceWaveform from "./VoiceWaveform";

const SUGGESTIONS = [
    { text: "Mock Interview", icon: <Layout01Icon size={14} />, action: "I want to prepare for a mock interview. " },
    { text: "ATS Check", icon: <File01Icon size={14} />, action: "Can you help me with my resume ATS check?" },
    { text: "Job Hacks", icon: <ZapIcon size={14} />, action: "Tell me a quick placement/job life hack." },
];

const TOOL_ROUTES = [
    { name: "Dashboard", path: "/dashboard", icon: <Layout01Icon size={14} /> },
    { name: "HR Interview", path: "/interview/hr/record", icon: <VoiceIcon size={14} /> },
    { name: "Session Interview", path: "/interview/session-interview", icon: <ComputerIcon size={14} /> },
    { name: "Live Interview", path: "/interview/live", icon: <ZapIcon size={14} /> },
    { name: "Resume View", path: "/resume-view", icon: <File01Icon size={14} /> },
    { name: "ATS Checker", path: "/resume/ats-check", icon: <File01Icon size={14} /> },
    { name: "Documentation", path: "/docs", icon: <File01Icon size={14} /> },
];

const BackgroundAura = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
            className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-[110px]"
            style={{
                background:
                    "radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0.08) 30%, transparent 70%)",
            }}
        />
        <motion.div
            className="absolute top-1/4 -right-24 w-[650px] h-[650px] rounded-full blur-[110px]"
            style={{
                background:
                    "radial-gradient(circle, rgba(245,158,11,0.12) 0%, rgba(245,158,11,0.06) 30%, transparent 70%)",
            }}
        />
    </div>
);

const CoachMateDrawer = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [isVoiceMode, setIsVoiceMode] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const chatEndRef = useRef(null);
    const navigate = useNavigate();
    const recognitionRef = useRef(null);

    // Initialize Speech Recognition and preload voices
    useEffect(() => {
        // Preload voices
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
        };

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                if (transcript) {
                    handleSend(transcript);
                }
            };
            recognition.onerror = (event) => {
                if (event.error === 'no-speech') {
                    console.log("No speech detected, stopping recognition.");
                } else {
                    console.error("Speech Recognition Error:", event.error);
                }
                setIsListening(false);
            };
            recognitionRef.current = recognition;
        }
    }, [isVoiceMode]);

    useEffect(() => {
        if (isOpen) {
            fetchHistory();
        }
    }, [isOpen]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading, isSpeaking, isListening]);

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

    const speak = (text) => {
        if (!isVoiceMode) return;

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);

        // Find a "girl" voice (preferring common high-quality female voices)
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(v =>
            v.name.toLowerCase().includes("female") ||
            v.name.toLowerCase().includes("woman") ||
            v.name.toLowerCase().includes("google us english") ||
            v.name.toLowerCase().includes("samantha") ||
            v.name.toLowerCase().includes("microsoft zira") ||
            v.name.toLowerCase().includes("victoria")
        );

        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }

        utterance.pitch = 1.1; // Slightly higher pitch for a friendlier tone
        utterance.rate = 1.0; // Natural speed

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
            setIsSpeaking(false);
            if (isVoiceMode && !loading) {
                startListening();
            }
        };
        window.speechSynthesis.speak(utterance);
    };

    const startListening = () => {
        if (recognitionRef.current && !isListening && !isSpeaking) {
            recognitionRef.current.start();
        }
    };

    const handleToggleVoice = () => {
        const nextState = !isVoiceMode;
        setIsVoiceMode(nextState);
        if (!nextState) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            if (recognitionRef.current) recognitionRef.current.stop();
        } else {
            startListening();
        }
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

                if (isVoiceMode) {
                    // Clean up markdown for better TTS
                    const cleanText = response.data.reply.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
                    speak(cleanText);
                }
            }
        } catch (error) {
            console.error("CoachMate Error:", error);
            const errorMsg = { role: "model", content: "I encountered an error. Could you rephrase or try again?", timestamp: new Date() };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    const extractTools = (content) => {
        return TOOL_ROUTES.filter(tool => content.includes(tool.path));
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
                                <h1 className="text-base font-bold text-white/90 tracking-tight flex items-center gap-2">
                                    CoachMate
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleToggleVoice}
                                className={`p-2 transition-colors cursor-pointer ${isVoiceMode ? "text-indigo-400" : "text-white/20 hover:text-white"}`}
                                title={isVoiceMode ? "Disable Voice Mode" : "Enable Voice Mode (Beta)"}
                            >
                                <Mic01Icon size={18} />
                            </button>
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
                                    <p className="text-sm text-white/30 max-w-[240px] leading-relaxed mb-8 font-medium italic">Your personal AI career coach. How can I assist you today?</p>

                                    {isVoiceMode ? (
                                        <div className="flex flex-col items-center gap-4">
                                            <button
                                                onClick={isListening ? () => recognitionRef.current.stop() : startListening}
                                                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isListening
                                                    ? "bg-gradient-to-tr from-indigo-500 to-amber-500 scale-110"
                                                    : "bg-gradient-to-tr from-indigo-500 to-amber-500"
                                                    }`}
                                            >
                                                {isListening ? <VoiceWaveform isListening={true} /> : <Mic01Icon size={28} className="text-white" />}
                                            </button>
                                            <span className="text-xs font-bold text-white/40 uppercase tracking-widest">
                                                {isListening ? "Listening..." : isSpeaking ? "CoachMate is speaking" : "Tap to Speak"}
                                            </span>
                                            {isSpeaking && <VoiceWaveform isSpeaking={true} />}
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleToggleVoice}
                                            className="px-6 py-3 bg-transparent cursor-pointer border border-white/10 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 group"
                                        >
                                            <Mic01Icon size={18} className="text-white/60 " />
                                            <span className="text-sm font-bold">Enable Voice Mode (Beta)</span>
                                        </button>
                                    )}
                                </motion.div>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg, idx) => {
                                    const suggestedTools = msg.role === "model" ? extractTools(msg.content) : [];

                                    return (
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

                                            {/* Tool Suggestion Cards */}
                                            {suggestedTools.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-3 w-full">
                                                    {suggestedTools.map((tool, tIdx) => (
                                                        <button
                                                            key={tIdx}
                                                            onClick={() => navigate(tool.path)}
                                                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-amber-500 text-white rounded-full hover:to-amber-400 transition-all text-[11px] font-bold active:scale-95 whitespace-nowrap cursor-pointer group opacity-90"
                                                        >
                                                            <span className="opacity-90">{tool.icon}</span>
                                                            {tool.name}
                                                            <span className="opacity-50 group-hover:translate-x-0.5 group-hover:opacity-100 transition-all">→</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            <span className="text-[10px] text-white/10 mt-1.5 px-1">
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    );
                                })}
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
                        {isVoiceMode && messages.length > 0 && (
                            <div className="mb-4">
                                {(isSpeaking || isListening) ? (
                                    <div className="flex flex-col items-center justify-center py-3 px-4 rounded-2xl">
                                        <VoiceWaveform isSpeaking={isSpeaking} isListening={isListening} />
                                        <span className="text-[9px] uppercase tracking-[0.15em] font-black text-white/40 mt-2">
                                            {isSpeaking ? "CoachMate Speaking" : "CoachMate Listening"}
                                        </span>
                                    </div>
                                ) : (
                                    <button
                                        onClick={startListening}
                                        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-gradient-to-r from-indigo-500 to-amber-500 text-white rounded-full hover:to-amber-400 transition-all cursor-pointer active:scale-[0.98] group"
                                    >
                                        <Mic01Icon size={18} className="group-hover:scale-110 transition-transform" />
                                        <span className="text-sm font-bold tracking-tight">Tap to speak to CoachMate</span>
                                    </button>
                                )}
                            </div>
                        )}

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
                                placeholder={isVoiceMode ? "Voice mode active..." : "Message CoachMate..."}
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





