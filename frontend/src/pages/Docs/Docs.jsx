import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import { useNavigate } from 'react-router-dom';

const Docs = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('introduction');

    const sections = [
        { id: 'introduction', title: 'Introduction' },
        { id: 'authentication', title: 'Authentication' },
        { id: 'dashboard', title: 'Dashboard' },
        { id: 'resume-checker', title: 'ATS Resume Checker' },
        { id: 'interview-prep', title: 'Interview Preparation' },
        { id: 'live-interview', title: 'Live Interview' },
        { id: 'admin', title: 'Admin Controls' },
    ];

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(id);
        }
    };

    // Handle scroll spy to update active section
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 150;

            for (const section of sections) {
                const element = document.getElementById(section.id);
                if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
                    setActiveSection(section.id);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const PathBadge = ({ path }) => (
        <code className="bg-[#1a1a1a] text-xs text-gray-400 px-2 py-1 rounded border border-[#333] font-mono ml-3">
            {path}
        </code>
    );

    return (
        <div className="min-h-screen bg-black text-gray-300 font-['Nunito'] selection:bg-white/20">
            <Navbar />

            <div className="pt-28 max-w-7xl mx-auto flex">
                {/* Sidebar Navigation */}
                <aside className="fixed w-64 h-[calc(100vh-7rem)] overflow-y-auto hidden md:block border-r border-[#1a1a1a] pr-6 custom-scrollbar">
                    <div className="mb-8 pl-4">
                        <h3 className="text-sm font-bold text-gray-100 mb-4 tracking-wider uppercase opacity-50">Content</h3>
                        <nav className="space-y-0.5">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    className={`block w-full text-left px-4 py-2 rounded text-sm transition-all duration-200 ${activeSection === section.id
                                        ? 'bg-[#151515] text-white font-semibold'
                                        : 'text-gray-500 hover:text-gray-300 hover:bg-[#0a0a0a]'
                                        }`}
                                >
                                    {section.title}
                                </button>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 md:pl-80 px-8 pb-32">
                    <div className="max-w-4xl mx-auto space-y-24">

                        {/* Introduction */}
                        <section id="introduction" className="scroll-mt-32">
                            <h1 className="text-4xl font-bold text-white mb-6 tracking-tight">
                                MockMate Documentation
                            </h1>
                            <p className="text-base text-gray-400 leading-7 font-light">
                                Comprehensive guide to the MockMate platform. Learn how to leverage our AI-driven tools to master your interview preparation, optimize your resume, and collaborate with peers.
                            </p>
                        </section>

                        <hr className="border-[#1a1a1a]" />

                        {/* Authentication */}
                        <section id="authentication" className="scroll-mt-32">
                            <div className="flex items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Authentication</h2>
                                <PathBadge path="/" />
                            </div>
                            <p className="text-sm text-gray-400 mb-6 leading-6">
                                Secure access to the platform via Google OAuth or Email/Password credentials. Authentication is handled via specific modals on the landing page.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg">
                                    <h3 className="text-sm font-semibold text-white mb-2">Login Flow</h3>
                                    <p className="text-xs text-gray-500 leading-5">
                                        Users can log in using their existing credentials. The system verifies the token and retrieves the user profile from the database context.
                                    </p>
                                </div>
                                <div className="p-5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg">
                                    <h3 className="text-sm font-semibold text-white mb-2">Sign Up Flow</h3>
                                    <p className="text-xs text-gray-500 leading-5">
                                        New users are registered with a default profile image and basic information. Data is persisted in specific collections.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Dashboard */}
                        <section id="dashboard" className="scroll-mt-32">
                            <div className="flex items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Dashboard</h2>
                                <PathBadge path="/dashboard" />
                            </div>
                            <p className="text-sm text-gray-400 mb-6 leading-6">
                                The central hub for managing interview sessions and accessing quick actions. Displays a grid of past sessions with summary analytics.
                            </p>

                            <div className="border border-[#1a1a1a] rounded-lg overflow-hidden">
                                <div className="bg-[#0f0f0f] px-4 py-2 border-b border-[#1a1a1a] text-xs font-mono text-gray-500">
                                    Feature Overview
                                </div>
                                <div className="p-6 bg-[#050505] space-y-6">
                                    <div>
                                        <h4 className="text-sm font-semibold text-white mb-1">Create Session</h4>
                                        <p className="text-xs text-gray-500">
                                            Initiate a new interview session by selecting the <span className="text-white">Job Role</span>, <span className="text-white">Experience Level</span>, and <span className="text-white">Focus Topics</span>.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-white mb-1">Quick Record</h4>
                                        <p className="text-xs text-gray-500">
                                            Access the recording module directly for unprompted practice. Supported modes: <span className="font-mono text-[10px] bg-[#1a1a1a] px-1 rounded">HR</span>, <span className="font-mono text-[10px] bg-[#1a1a1a] px-1 rounded">Session</span>, <span className="font-mono text-[10px] bg-[#1a1a1a] px-1 rounded">Live</span>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Resume Checker */}
                        <section id="resume-checker" className="scroll-mt-32">
                            <div className="flex items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">ATS Resume Checker</h2>
                                <PathBadge path="/resume/ats-check" />
                            </div>
                            <p className="text-sm text-gray-400 mb-6 leading-6">
                                Analyze resume PDFs against Applicant Tracking System (ATS) algorithms. Provides a score and detailed feedback on missing keywords and formatting.
                            </p>

                            <div className="space-y-3">
                                <div className="flex items-start gap-4 p-4 rounded-lg bg-[#0a0a0a] border border-[#1a1a1a]">
                                    <div className="w-1 h-full bg-blue-500 rounded-full"></div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-white">Parser</h4>
                                        <p className="text-xs text-gray-500 mt-1">Extracts text content using OCR-like mechanisms to identify readable sections versus unreadable graphics.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 rounded-lg bg-[#0a0a0a] border border-[#1a1a1a]">
                                    <div className="w-1 h-full bg-green-500 rounded-full"></div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-white">Scoring Engine</h4>
                                        <p className="text-xs text-gray-500 mt-1">Calculates a match percentage based on the job description provided and the extracted resume keywords.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Interview Prep */}
                        <section id="interview-prep" className="scroll-mt-32">
                            <div className="flex items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Interview Preparation</h2>
                                <PathBadge path="/interview-prep/:sessionId" />
                            </div>
                            <p className="text-sm text-gray-400 mb-6 leading-6">
                                Examples of the core simulation interface. Conducts audio-visual interview sessions with AI feedback.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-[#050505] p-5 rounded border border-[#1a1a1a]">
                                    <h4 className="text-sm font-bold text-white mb-2">Session Interview</h4>
                                    <PathBadge path="/interview/session-interview" />
                                    <p className="text-xs text-gray-500 mt-3 leading-5">
                                        Standard AI mock interview. The AI asks questions based on the session configuration. User responses are recorded and transcribed.
                                    </p>
                                </div>
                                <div className="bg-[#050505] p-5 rounded border border-[#1a1a1a]">
                                    <h4 className="text-sm font-bold text-white mb-2">HR Round</h4>
                                    <PathBadge path="/interview/hr/record" />
                                    <p className="text-xs text-gray-500 mt-3 leading-5">
                                        Specific module for behavioral and HR-related questions. Focuses on soft skills, communication clarity, and situational responses.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Live Interview */}
                        <section id="live-interview" className="scroll-mt-32">
                            <div className="flex items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Live Interview</h2>
                                <PathBadge path="/interview/live" />
                            </div>
                            <p className="text-sm text-gray-400 mb-6 leading-6">
                                Peer-to-peer interview mode. Allows two users to connect via WebRTC for a live video and coding session.
                            </p>

                            <div className="p-6 bg-[#080808] border border-[#1a1a1a] rounded flex flex-col gap-4">
                                <div className="flex justify-between items-center border-b border-[#1a1a1a] pb-4">
                                    <span className="text-sm text-gray-300">Feature</span>
                                    <span className="text-sm text-gray-300">Technology</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">Video Sync</span>
                                    <span className="text-xs text-gray-600 font-mono">WebRTC / Peerjs</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">Code Editor</span>
                                    <span className="text-xs text-gray-600 font-mono">Monaco Editor</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">State Management</span>
                                    <span className="text-xs text-gray-600 font-mono">Socket.io</span>
                                </div>
                            </div>
                        </section>

                        {/* Admin */}
                        <section id="admin" className="scroll-mt-32">
                            <div className="flex items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Admin Controls</h2>
                                <PathBadge path="/admin" />
                            </div>
                            <p className="text-sm text-gray-400 mb-4 leading-6">
                                Restricted area for platform administration. Managing user roles, viewing global analytics, and system configurations.
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                <span className="text-xs text-red-500">Restricted Access</span>
                            </div>
                        </section>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default Docs;
