import React from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import {
    UserCircleIcon,
    DashboardSquare01Icon,
    File02Icon,
    VideoReplayIcon,
    UserGroupIcon,
    ArrowLeft01Icon,
    Rocket01Icon,
    BulbIcon
} from 'hugeicons-react';
import { useNavigate } from 'react-router-dom';

const Docs = () => {
    const navigate = useNavigate();

    const Section = ({ title, children, icon }) => (
        <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white">
                    {icon}
                </div>
                <h2 className="text-2xl font-bold text-white">{title}</h2>
            </div>
            <div className="text-neutral-400 leading-relaxed text-lg space-y-4">
                {children}
            </div>
        </div>
    );

    const FeatureCard = ({ title, description }) => (
        <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 p-6 rounded-xl hover:border-neutral-700 transition-all group">
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">{description}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-dots-dark font-['Nunito'] selection:bg-white/20">
            <Navbar />

            <div className="max-w-4xl mx-auto pt-32 pb-20 px-6">

                {/* Header */}
                <div className="text-center mb-20">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        How it works.
                    </h1>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                        Everything you need to know about using MockMate to crush your next interview. Simple, powerful, and AI-driven.
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-20">

                    {/* Intro */}
                    <Section title="Welcome to MockMate" icon={<Rocket01Icon size={20} />}>
                        <p>
                            MockMate is your personal AI interview coach. We've designed it to be as simple as possible: you practice, we analyze, and you get better. No complex setups, no confusing metrics—just straight feedback to help you improve.
                        </p>
                    </Section>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-2 gap-4 mb-20">
                        <FeatureCard
                            title="Mock Interviews"
                            description="Take realistic interviews customized to your job role. Our AI acts as the interviewer, asking relevant questions and listening to your answers."
                        />
                        <FeatureCard
                            title="Resume Optimizer"
                            description="Upload your resume and let our ATS-checker scan it. We'll tell you exactly what keywords are missing and how to format it for machines."
                        />
                        <FeatureCard
                            title="Peer Connect"
                            description="Practice with real people. Connect with peers for live coding sessions and behavioral practice using video and collaborative code editors."
                        />
                        <FeatureCard
                            title="Dashboard"
                            description="Track your progress over time. See your scores improve, review past feedback, and manage your recordings all in one place."
                        />
                    </div>

                    {/* Getting Started */}
                    <Section title="Getting Started" icon={<UserCircleIcon size={20} />}>
                        <p>
                            Starting is easy. If you haven't already, <span className="text-white font-medium">Create an Account</span>. We support Google Login for one-click access.
                        </p>
                        <p>
                            Once you're in, head to the <strong>Dashboard</strong>. From there, you can start a new interview session immediately or upload your resume for a quick check.
                        </p>
                    </Section>

                    {/* Pro Tips */}
                    <Section title="Pro Tips" icon={<BulbIcon size={20} />}>
                        <ul className="space-y-4 list-none">
                            <li className="flex gap-3">
                                <span className="text-yellow-500 font-bold">•</span>
                                <span>Use headphones for the best audio experience during AI interviews.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-yellow-500 font-bold">•</span>
                                <span>Speak clearly and at a normal pace. Our AI is good, but clarity helps it give better feedback.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-yellow-500 font-bold">•</span>
                                <span>Review your resume feedback carefully. Small changes in formatting can make a huge difference to ATS parsers.</span>
                            </li>
                        </ul>
                    </Section>

                </div>

                {/* Footer */}
                <div className="mt-20 pt-10 border-t border-neutral-900 text-center">
                    <p className="text-neutral-600 mb-6">Ready to practice?</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-neutral-200 transition-colors inline-flex items-center gap-2"
                    >
                        Go to Dashboard <ArrowLeft01Icon className="rotate-180" size={18} />
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Docs;
