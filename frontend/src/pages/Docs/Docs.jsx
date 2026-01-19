import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import { useNavigate } from 'react-router-dom';

const Docs = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('introduction');

    const sections = [
        { id: 'introduction', title: 'Introduction' },
        { id: 'getting-started', title: 'Getting Started' },
        { id: 'dashboard', title: 'Dashboard' },
        { id: 'resume-checker', title: 'Resume Checker' },
        { id: 'interview-prep', title: 'Interview Prep' },
        { id: 'live-interview', title: 'Live Interview' },
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
            const scrollPosition = window.scrollY + 200; // Offset

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

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-mono selection:bg-yellow-500/30">
            <Navbar />

            <div className="pt-28 max-w-7xl mx-auto flex">
                {/* Sidebar Navigation */}
                <aside className="fixed w-64 h-[calc(100vh-7rem)] overflow-y-auto hidden md:block border-r border-gray-800/50 pr-6 custom-scrollbar">
                    <div className="mb-8 pl-4">
                        <h3 className="text-xl font-bold text-gray-100 mb-6 tracking-tight border-l-4 border-yellow-500 pl-3">Documentation</h3>
                        <nav className="space-y-1">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    className={`block w-full text-left px-4 py-2.5 rounded-r-lg text-[0.95rem] transition-all duration-200 border-l-[3px] ${activeSection === section.id
                                        ? 'bg-white/5 border-yellow-400 text-yellow-400 font-bold translate-x-1'
                                        : 'border-transparent text-gray-400 hover:text-gray-100 hover:bg-white/5 hover:border-gray-600'
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
                    <div className="max-w-4xl mx-auto space-y-20">

                        {/* Introduction */}
                        <section id="introduction" className="scroll-mt-32">
                            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-8 leading-tight tracking-tight">
                                MockMate Docs
                            </h1>
                            <p className="text-xl leading-relaxed text-gray-400 mb-8 font-light">
                                Welcome to the comprehensive documentation for <strong className="text-gray-100 font-semibold">MockMate</strong>.
                                This platform is meticulously engineered to bridge the gap between potential and professional success.
                                Whether you are a fresh graduate or a seasoned professional, our suite of tools—powered by advanced AI—is designed to refine every aspect of your interview readiness.
                            </p>
                            <p className="text-lg leading-relaxed text-gray-400 mb-8">
                                Inside these docs, you will find deep dives into every feature, from the granular analysis of our Resume Checker to the real-time simulation logic of our AI Interviewer. We believe that preparation should be precise, data-driven, and accessible.
                            </p>
                            <div className="p-8 bg-[#111] border border-gray-800 rounded-2xl relative overflow-hidden group hover:border-yellow-500/30 transition-colors duration-300">
                                <div className="absolute top-0 right-0 p-6 opacity-[0.03] text-9xl pointer-events-none select-none">
                                    "
                                </div>
                                <p className="italic text-gray-300 relative z-10 text-lg font-medium text-center">
                                    "The secret of success in life is for a man to be ready for his opportunity when it comes."
                                </p>
                            </div>
                        </section>

                        <hr className="border-gray-800/60" />

                        {/* Getting Started */}
                        <section id="getting-started" className="scroll-mt-32">
                            <h2 className="text-4xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="text-yellow-500">#</span> Getting Started
                            </h2>
                            <p className="text-gray-400 mb-6 leading-relaxed text-lg">
                                Embarking on your MockMate journey is straightforward but secure. We utilize a robust authentication system to ensure your data—resumes, interview recordings, and performance analytics—remains private and accessible only to you.
                            </p>

                            <h3 className="text-2xl font-semibold text-white mt-10 mb-4">Account Creation & Setup</h3>
                            <p className="text-gray-400 mb-6 leading-relaxed">
                                You can initialize an account using your Google credentials for a one-click signup, or opt for a standard email/password registration. Upon first login, we recommend completing your user profile to personalize the experience.
                            </p>

                            <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-6 text-sm text-gray-300 relative">
                                <span className="absolute top-3 right-4 text-xs text-gray-600">Action Flow</span>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs border border-blue-500/20">1</span>
                                        <p><span className="text-blue-400 font-semibold">Navigate</span> to the Landing Page.</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs border border-blue-500/20">2</span>
                                        <p><span className="text-blue-400 font-semibold">Click</span> "Get Started" to trigger the Auth Modal.</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs border border-blue-500/20">3</span>
                                        <p><span className="text-blue-400 font-semibold">Authenticate</span> via Google OAuth or Email.</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center text-xs border border-green-500/20">4</span>
                                        <p><span className="text-green-400 font-semibold">Success</span> Redirect to Dashboard.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Dashboard */}
                        <section id="dashboard" className="scroll-mt-32">
                            <h2 className="text-4xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="text-yellow-500">#</span> Dashboard
                            </h2>
                            <p className="text-gray-400 mb-6 leading-relaxed text-lg">
                                The Dashboard is your mission control center. It's not just a menu; it's a dynamic interface that aggregates your progress. From here, you can launch new simulation sessions, review past performance cards, and manage your uploaded assets.
                            </p>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                                <div className="space-y-4">
                                    <h4 className="text-xl font-semibold text-white border-b border-gray-800 pb-2">Session Architecture</h4>
                                    <p className="text-gray-400 leading-relaxed">
                                        Each interview practice is encapsulated in a "Session". A Session holds the context—job role, experience level, and specific technical topics. This allows the AI to tailor questions precisely to the scenario you want to practice.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-xl font-semibold text-white border-b border-gray-800 pb-2">Analytics at a Glance</h4>
                                    <p className="text-gray-400 leading-relaxed">
                                        Summary cards provide immediate insight into your last activity. You can see the number of questions answered, the specialized topics covered (e.g., "React Hooks", "System Design"), and the date of your last practice.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Resume Checker */}
                        <section id="resume-checker" className="scroll-mt-32">
                            <h2 className="text-4xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="text-yellow-500">#</span> Resume Checker
                            </h2>
                            <p className="text-gray-400 mb-6 leading-relaxed text-lg">
                                In today's competitive market, most resumes are filtered by bots before humans ever see them. Our ATS (Applicant Tracking System) Checker mimics these algorithms to give you a definitive edge.
                            </p>

                            <div className="bg-[#111] p-8 rounded-2xl border border-gray-800 space-y-8">
                                <div>
                                    <h4 className="text-2xl font-semibold text-white mb-3">Parsing Engine</h4>
                                    <p className="text-gray-400 leading-relaxed">
                                        We utilize advanced natural language processing to strip down your uploaded PDF. We analyze the <span className="text-yellow-500">text density</span>, <span className="text-yellow-500">formatting readability</span>, and <span className="text-yellow-500">section hierarchy</span>. Complex tables or graphics that confuse standard parsers are identified and flagged.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-4 bg-black rounded-lg border border-gray-800">
                                        <h5 className="text-yellow-400 font-bold mb-1">Keyword Matching</h5>
                                        <p className="text-xs text-gray-500">Compares your resume against a database of standard job descriptions to find missing terms.</p>
                                    </div>
                                    <div className="p-4 bg-black rounded-lg border border-gray-800">
                                        <h5 className="text-blue-400 font-bold mb-1">Impact Analysis</h5>
                                        <p className="text-xs text-gray-500">Checks for action verbs and quantifiable metrics (e.g., "Increased sales by 20%").</p>
                                    </div>
                                    <div className="p-4 bg-black rounded-lg border border-gray-800">
                                        <h5 className="text-red-400 font-bold mb-1">Contact Validation</h5>
                                        <p className="text-xs text-gray-500">Ensures professional contact details (Email, LinkedIn, Portfolio) are easily extractable.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Interview Prep */}
                        <section id="interview-prep" className="scroll-mt-32">
                            <h2 className="text-4xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="text-yellow-500">#</span> Interview Prep
                            </h2>
                            <p className="text-gray-400 mb-8 leading-relaxed text-lg">
                                The core of MockMate. We don't just give you a list of questions; we simulate the pressure and flow of a real interview. Our AI adopts a persona based on your session settings—be it a supportive HR manager or a critical technical lead.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-6 items-start p-6 bg-white/5 rounded-xl border border-white/5 hover:bg-white/[0.07] transition-all">
                                    <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400 border border-blue-500/20">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-bold text-white mb-2">AI Voice Interview</h4>
                                        <p className="text-gray-400 mb-3 leading-relaxed">
                                            Experience a full duplex conversation. The AI listens to your spoken answers, converts speech to text, analyzes the content for technical accuracy and soft skills, and responds with follow-up questions.
                                        </p>
                                        <ul className="text-sm text-gray-500 list-disc list-inside space-y-1">
                                            <li><span className="text-gray-300">Latency Optimization:</span> Near-instant voice response.</li>
                                            <li><span className="text-gray-300">Tone Analysis:</span> Feedback on confidence and clarity.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="flex gap-6 items-start p-6 bg-white/5 rounded-xl border border-white/5 hover:bg-white/[0.07] transition-all">
                                    <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400 border border-purple-500/20">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-bold text-white mb-2">Contextual Question Engine</h4>
                                        <p className="text-gray-400 mb-3 leading-relaxed">
                                            Questions are dynamically generated. If you mention "Redux" in a React interview, the AI might drill down into "Middleware" or "Thunks" next. This adaptive difficulty ensures you are pushed to your limits.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Live Interview */}
                        <section id="live-interview" className="scroll-mt-32">
                            <h2 className="text-4xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="text-yellow-500">#</span> Live Peer-to-Peer
                            </h2>
                            <p className="text-gray-400 mb-8 leading-relaxed text-lg">
                                While AI is powerful, human interaction is unpredictable. our Live Interview module enables you to conduct mock interviews with friends or peers in a synchronized environment.
                            </p>

                            <div className="relative rounded-2xl overflow-hidden bg-[#0f1015] border border-gray-800 p-10">

                                <div className="flex flex-col md:flex-row items-center gap-8">
                                    <div className="flex-1 space-y-4">
                                        <h3 className="text-3xl font-bold text-white">Collaborative IDE </h3>
                                        <p className="text-gray-300 leading-relaxed">
                                            Code together in real-time. Changes made by one user are instantly reflected on the other's screen using operational transformation algorithms, ensuring conflict-free collaboration.
                                        </p>
                                        <div className="flex gap-4 pt-2">
                                            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-full text-sm border border-indigo-500/30">WebRTC Video</span>
                                            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-full text-sm border border-indigo-500/30">Socket.io Sync</span>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-1/3 aspect-video bg-black/50 rounded-lg border border-white/10 flex items-center justify-center relative">
                                        {/* Removed blur effect here */}
                                        <span className="text-indigo-400 font-mono text-xl z-10">Coming soon</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default Docs;
