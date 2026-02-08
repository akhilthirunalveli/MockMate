import React, { useRef } from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import {
    Rocket01Icon,
    VideoReplayIcon,
    File02Icon,
    UserGroupIcon,
    ArrowLeft01Icon,
    Cursor01Icon
} from 'hugeicons-react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

const Step = ({ index, title, description, asset, icon, isLast }) => {
    const isEven = index % 2 === 0;

    return (
        <div className="relative mb-32 md:mb-48">
            {/* Timeline Connector */}
            {!isLast && (
                <div className="absolute left-8 md:left-1/2 top-16 bottom-[-128px] md:bottom-[-192px] w-[2px] bg-neutral-800 hidden md:block" />
            )}

            <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-24`}>
                {/* Image Section */}
                <motion.div
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex-1 w-full"
                >
                    <div className="relative">
                        <div className="relative bg-black rounded-[20px] overflow-hidden border border-neutral-800 shadow-2xl">
                            <img
                                src={asset}
                                alt={title}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Text Section */}
                <motion.div
                    initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex-1 space-y-6 text-center md:text-left pt-8 md:pt-0"
                >
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                        <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center font-bold text-xl">
                            {index + 1}
                        </div>
                        <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white">
                            {icon}
                        </div>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                        {title}
                    </h2>

                    <p className="text-neutral-400 text-lg leading-relaxed max-w-lg mx-auto md:mx-0">
                        {description}
                    </p>

                    <div className="pt-4 flex items-center justify-center md:justify-start gap-2 text-neutral-500 text-sm font-medium">
                        <Cursor01Icon size={16} />
                        Scroll to continue
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const Docs = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const steps = [
        {
            title: "Strategize: Session Prep",
            description: "Define your targets. Create specialized practice sessions tailored to specific job roles, technologies, and company cultures. Setting the context allows our AI to challenge you exactly where it matters.",
            asset: "/Assets/Session - CreateSession.png",
            icon: <Rocket01Icon size={20} />
        },
        {
            title: "Practice: The Arena",
            description: "Choose your battleground. Engage in HR-style behavioral rounds, deep-dive technical drills, or the high-intensity Live Interview mode. Every word is recorded, analyzed, and refined by AI.",
            asset: "/Assets/Interview - SessionInterview.png",
            icon: <VideoReplayIcon size={20} />
        },
        {
            title: "Analyze: Resume & ATS",
            description: "Your gateway to the job. Use our Bento-style resume workspace to manage links, receive AI-powered optimization tips, and run full ATS scans to ensure you pass the machine filter first.",
            asset: "/Assets/Resume - ViewResume.png",
            icon: <File02Icon size={20} />
        },
        {
            title: "Manage: Admin Control",
            description: "Total visibility. For power users and organizations, the admin console provides a centralized dashboard to manage users, monitor sessions, and broadcast system-wide updates.",
            asset: "/Assets/AdminDashboard.png",
            icon: <UserGroupIcon size={20} />
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20 overflow-x-hidden font-['Nunito']">
            <div className="fixed inset-0 bg-dots-dark opacity-40 pointer-events-none" />
            <Navbar />

            {/* Progress Top Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-white z-[100] origin-left"
                style={{ scaleX: scrollYProgress }}
            />

            <div className="max-w-7xl mx-auto px-6 relative z-10" ref={containerRef}>
                {/* Hero */}
                <header className="pt-32 pb-24 md:pt-48 md:pb-40 text-center relative">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 text-white">
                            The Blueprint.
                        </h1>
                        <p className="text-xl md:text-2xl text-neutral-400 max-w-3xl mx-auto font-light leading-relaxed">
                            Mastering the MockMate ecosystem. A technical walkthrough from initial setup to interview excellence.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                    >
                        <span className="text-neutral-600 text-[10px] uppercase tracking-widest font-bold">Scroll to start</span>
                        <div className="w-[1px] h-12 bg-neutral-800" />
                    </motion.div>
                </header>

                {/* Timeline Section */}
                <main className="relative pt-20">
                    {steps.map((step, index) => (
                        <Step
                            key={index}
                            index={index}
                            {...step}
                            isLast={index === steps.length - 1}
                        />
                    ))}
                </main>
            </div>

            {/* Custom Styles for dots */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .bg-dots-dark {
                    background-image: radial-gradient(#333 1px, transparent 1px);
                    background-size: 30px 30px;
                }
            `}} />
        </div>
    );
};

export default Docs;
