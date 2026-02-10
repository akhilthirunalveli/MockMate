import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft01Icon,
    CheckmarkCircle02Icon,
    AlertCircleIcon,
    Pdf02Icon,
    FolderUploadIcon,
    PencilEdit01Icon,
    Cancel01Icon,
    BarChartIcon,
    Book01Icon,
    TimeScheduleIcon,
    CodeIcon
} from "hugeicons-react";


import DashboardLayout from "../Home/Components/DashboardLayout";
import { useReactToPrint } from "react-to-print";
import { extractTextFromPdf, extractTextFromDocx } from "../../utils/FileParsers";
import toast from "react-hot-toast";

const ATSCheckerPage = () => {
    const navigate = useNavigate();
    const componentRef = useRef();

    // State
    const [view, setView] = useState("input"); // 'input' | 'report'
    const [inputMethod, setInputMethod] = useState("upload"); // 'upload' | 'text'
    const [resumeText, setResumeText] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isParsing, setIsParsing] = useState(false);
    const [results, setResults] = useState(null);
    const [fileName, setFileName] = useState("");

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: "ATS_Analysis_Report",
    });

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileName(file.name);
        setIsParsing(true);
        try {
            let text = "";
            if (file.type === "application/pdf") {
                text = await extractTextFromPdf(file);
            } else if (
                file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ) {
                text = await extractTextFromDocx(file);
            } else {
                toast.error("Unsupported file format. Please upload PDF or DOCX.");
                setIsParsing(false);
                return;
            }

            if (!text.trim()) {
                toast.error("Could not extract text. Please try pasting instead.");
            } else {
                setResumeText(text);
                toast.success("Resume parsed successfully!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to parse file.");
        } finally {
            setIsParsing(false);
        }
    };

    const analyzeResume = () => {
        if (!resumeText.trim()) {
            toast.error("Please provide resume content first.");
            return;
        }
        setIsAnalyzing(true);
        setTimeout(() => {
            const score = calculateScore(resumeText, jobDescription);
            setResults(score);
            setIsAnalyzing(false);
            setView("report");
        }, 2000);
    };

    const calculateScore = (resume, jd) => {
        let score = 0;
        const feedback = {
            missingKeywords: [],
            sections: [],
            formatting: [],
            contactInfo: {},
            impact: { actionVerbsCount: 0, metricsCount: 0 },
            softSkills: [],
            hardSkills: [],
            advanced: {}
        };

        const lowerResume = resume.toLowerCase();
        const lowerJd = jd.toLowerCase();

        // 1. Keyword Matching (Weight: 25%)
        if (jd) {
            const potentialKeywords = lowerJd.match(/\b([a-zA-Z]{4,})\b/g) || [];
            const stopWords = ["with", "that", "this", "from", "have", "will", "looking", "working", "experience", "knowledge", "skills", "ability", "qualifications", "requirements", "about", "role"];
            const uniqueKeywords = [...new Set(potentialKeywords.filter(k => !stopWords.includes(k)))];
            const jdKeywords = uniqueKeywords.sort((a, b) => b.length - a.length).slice(0, 20);

            const foundKeywords = jdKeywords.filter(k => lowerResume.includes(k));
            feedback.missingKeywords = jdKeywords.filter(k => !lowerResume.includes(k));

            if (jdKeywords.length > 0) {
                score += (foundKeywords.length / jdKeywords.length) * 25;
            } else {
                score += 25;
            }
        } else {
            score += 10;
        }

        // 2. Sections (Weight: 20%)
        const sections = ["experience", "education", "skills", "projects", "summary", "contact", "languages", "certifications"];
        let sectionsFound = 0;
        sections.forEach(sec => {
            if (lowerResume.includes(sec)) {
                sectionsFound++;
                feedback.sections.push({ name: sec, found: true });
            } else {
                feedback.sections.push({ name: sec, found: false });
            }
        });
        score += (sectionsFound / sections.length) * 20;

        // 3. Formatting (Weight: 10%)
        const wordCount = resume.split(/\s+/).length;
        if (wordCount >= 400 && wordCount <= 1200) {
            score += 5;
            feedback.formatting.push({ msg: "Optimal word count", status: "good", val: wordCount });
        } else {
            feedback.formatting.push({ msg: "Word count Check", status: "warn", val: wordCount });
        }
        if (resume.includes("•") || resume.includes("- ")) {
            score += 5;
            feedback.formatting.push({ msg: "Bullet points", status: "good" });
        } else {
            feedback.formatting.push({ msg: "Use bullet points", status: "warn" });
        }

        // 4. Contact Info (Weight: 15%)
        const email = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resume);
        const phone = /(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/.test(resume);
        const linkedin = /linkedin\.com\/in\//i.test(resume) || lowerResume.includes("linkedin");
        const github = /github\.com\//i.test(resume) || lowerResume.includes("github");
        const portfolio = /portfolio|website|medium\.com/i.test(resume);

        if (email) score += 3;
        if (phone) score += 3;
        if (linkedin) score += 3;
        if (github || portfolio) score += 6;
        feedback.contactInfo = { email, phone, linkedin, github, portfolio };

        // 5. Impact (Weight: 15%)
        const verbs = ["managed", "created", "led", "designed", "built", "increased", "reduced", "improved", "developed", "analyzed", "architected", "deployed", "scaled"];
        let verbsCount = 0;
        verbs.forEach(v => { if (lowerResume.includes(v)) verbsCount++; });

        const metrics = (resume.match(/\d+%|\$\d+|\d+\s*users|\d+\s*year|increased|reduced/gi) || []).length;

        score += Math.min(verbsCount * 2, 8);
        score += Math.min(metrics * 3, 7);
        feedback.impact.actionVerbsCount = verbsCount;
        feedback.impact.metricsCount = metrics;

        // 6. Skills Analysis (Weight: 15%)
        const commonSoftSkills = ["communication", "teamwork", "leadership", "problem solving", "adaptability", "critical thinking", "time management", "creativity"];
        const commonHardSkills = ["python", "javascript", "react", "java", "c++", "sql", "aws", "docker", "excel", "project management", "data analysis", "marketing", "sales", "figma", "git", "typescript", "golang", "rust", "kubernetes", "terraform"];

        feedback.softSkills = commonSoftSkills.filter(s => lowerResume.includes(s));
        feedback.hardSkills = commonHardSkills.filter(s => lowerResume.includes(s));

        const skillScore = Math.min((feedback.softSkills.length + feedback.hardSkills.length) * 2, 15);
        score += skillScore;

        // 7. Advanced Metrics
        // Readability (Flesch Kincaid grade level approx)
        const sentences = resume.split(/[.!?]+/).length;
        const syllables = resume.split(/[aeiouy]+/).length;
        const readabilityScore = 206.835 - (1.015 * (wordCount / sentences)) - (84.6 * (syllables / wordCount));
        const readingGrade = Math.round(0.39 * (wordCount / sentences) + 11.8 * (syllables / wordCount) - 15.59);

        // Experience Level Detection
        const experienceYears = (resume.match(/(\d+)\+?\s*years?/gi) || []).map(s => parseInt(s));
        const maxExperience = experienceYears.length ? Math.max(...experienceYears) : 0;
        let level = "Entry Level";
        if (maxExperience > 2) level = "Mid Level";
        if (maxExperience > 5) level = "Senior Level";
        if (maxExperience > 8) level = "Executive / Lead";

        feedback.advanced = {
            readingGrade: readingGrade > 0 ? readingGrade : 12, // Default to 12 if calculation fails
            readabilityScore: Math.round(readabilityScore),
            level,
            completeness: Math.round((sectionsFound / sections.length) * 100)
        };

        return { score: Math.min(Math.round(score), 100), feedback };
    };

    return (
        <DashboardLayout>
            <div className="pb-20 px-6 md:px-12 w-full max-w-[1920px] mx-auto" style={{ fontFamily: "'Nunito', sans-serif" }}>
                <AnimatePresence mode="wait">
                    {view === "input" ? (
                        <motion.div
                            key="input"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-[calc(100vh-140px)] flex flex-col"
                        >
                            {/* Header - Compact */}
                            <div className="flex justify-between items-center px-2 mb-4 shrink-0">
                                <div>
                                    <h1 className="text-2xl font-bold text-white tracking-tight">ATS Analysis</h1>
                                    <p className="text-white/80 text-xs">Optimize your resume for the algorithms.</p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="bg-black p-1 rounded-xl flex border border-white/10 relative overflow-hidden">
                                        {[
                                            { id: "upload", label: "File Upload", icon: FolderUploadIcon },
                                            { id: "text", label: "Paste Text", icon: PencilEdit01Icon },
                                        ].map((method) => (
                                            <button
                                                key={method.id}
                                                onClick={() => setInputMethod(method.id)}
                                                className={`relative z-10 px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${inputMethod === method.id ? "text-black" : "text-white/50 hover:text-white/90"
                                                    }`}
                                            >
                                                <method.icon className="text-lg" />
                                                <span className="hidden sm:inline">{method.label}</span>
                                                {inputMethod === method.id && (
                                                    <motion.div
                                                        layoutId="activeInputMethod"
                                                        className="absolute inset-0 bg-white/90 rounded-lg -z-10 shadow-sm"
                                                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                                                    />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Split Screen Content */}
                            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 pb-4">
                                {/* Left Panel: Resume Input (65% width -> col-span-8) */}
                                <div className="lg:col-span-8 bg-black border border-white/5 rounded-2xl relative overflow-hidden group transition-all flex flex-col">
                                    {inputMethod === "upload" ? (
                                        <div className="h-full flex flex-col items-center justify-center border-1 border-dashed border-white/5 rounded-2xl m-2 transition-all bg-zinc-950/30 relative">
                                            <input
                                                type="file"
                                                onChange={handleFileUpload}
                                                accept=".pdf,.docx"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="bg-blue-500/10 p-4 rounded-full mb-3 transaction-transform group-hover:scale-110 duration-300">
                                                <FolderUploadIcon className="text-blue-500 text-3xl" />
                                            </div>
                                            <h3 className="text-lg font-bold text-white mb-1">
                                                {isParsing ? "Parsing..." : fileName ? "File Selected" : "Upload Resume"}
                                            </h3>
                                            <p className="text-gray-500 text-xs text-center px-4">
                                                {fileName ? <span className="text-green-400 font-medium">{fileName}</span> : "PDF or DOCX"}
                                            </p>
                                        </div>
                                    ) : (
                                        <textarea
                                            value={resumeText}
                                            onChange={(e) => setResumeText(e.target.value)}
                                            placeholder="Paste your resume content here..."
                                            className="w-full h-full bg-transparent text-white placeholder-white/50 focus:outline-none resize-none custom-scrollbar p-6 text-sm leading-relaxed"
                                            style={{ fontFamily: "'Nunito', sans-serif" }}
                                        />
                                    )}
                                </div>

                                {/* Right Panel: Job Description (35% width -> col-span-4) */}
                                <div className="lg:col-span-4 bg-black border border-white/5 rounded-2xl flex flex-col relative group transition-all p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-white/90 text-base font-medium ml-2">Description</span>
                                        <span className="text-xs font-medium text-white/50 uppercase tracking-widest px-2 py-1 rounded border border-white/5">Target Job</span>
                                    </div>
                                    <textarea
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        placeholder="Paste the job description here..."
                                        className="w-full flex-1 bg-transparent text-gray-300 placeholder-white/50 focus:outline-none resize-none custom-scrollbar p-2 text-sm leading-relaxed"
                                    />
                                    <button
                                        onClick={analyzeResume}
                                        disabled={!resumeText || isAnalyzing || isParsing}
                                        className={`w-full mt-4 py-3 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg flex cursor-pointer items-center justify-center gap-2 ${!resumeText || isAnalyzing || isParsing
                                            ? "bg-white/50 text-black cursor-not-allowed border border-white/5"
                                            : "bg-white text-black hover:bg-gray-100 transform hover:scale-[1.02] active:scale-[0.98]"
                                            }`}
                                    >
                                        {isAnalyzing ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                Analyzing
                                            </>
                                        ) : (
                                            <>
                                                Analyze Match <ArrowLeft01Icon className="rotate-180" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Floating Action Bar Removed */}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="report"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            {/* Navbar-aligned Header */}
                            <div className="flex flex-col md:flex-row justify-between items-center bg-black p-3 rounded-2xl backdrop-blur-md sticky top-24 z-20 shadow-2xl">
                                <button
                                    onClick={() => setView("input")}
                                    className="flex items-center gap-2 px-6 py-2.5 hover:bg-white/5 rounded-xl text-white/80 hover:text-white transition-colors text-base font-medium cursor-pointer"
                                >
                                    <ArrowLeft01Icon /> Edit Inputs
                                </button>
                                <h2 className="text-white font-bold text-2xl hidden md:block tracking-tight">Analysis Report</h2>
                                <button
                                    onClick={handlePrint}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-white text-black hover:bg-gray-200 rounded-xl font-bold transition-colors text-sm shadow-lg hover:shadow-xl cursor-pointer"
                                >
                                    <Pdf02Icon size={18} /> Export PDF
                                </button>
                            </div>

                            <div ref={componentRef} className="print:bg-white print:text-black print:p-8">
                                {/* Main Bento Grid - Expanded Width */}
                                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-8">

                                    {/* 1. Score Card (Tall Left) */}
                                    <div className="md:col-span-2 lg:col-span-2 lg:row-span-2 bg-black border border-white/5 rounded-xl p-8 flex flex-col items-center justify-center relative overflow-hidden group print:border-gray-200 print:bg-white">
                                        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 blur-[60px] rounded-full point-events-none" />

                                        <h3 className="text-white/80 font-medium mb-8 z-10 print:text-black uppercase tracking-widest text-sm">Match Score</h3>
                                        <div className="relative w-56 h-56 z-10">
                                            <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl">
                                                <circle cx="112" cy="112" r="100" stroke="#1a1a1a" strokeWidth="16" fill="transparent" />
                                                <motion.circle
                                                    initial={{ strokeDashoffset: 2 * Math.PI * 100 }}
                                                    animate={{ strokeDashoffset: 2 * Math.PI * 100 * (1 - results.score / 100) }}
                                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                                    cx="112" cy="112" r="100"
                                                    stroke={results.score >= 80 ? "#22c55e" : results.score >= 60 ? "#eab308" : "#ef4444"}
                                                    strokeWidth="16"
                                                    fill="transparent"
                                                    strokeDasharray={2 * Math.PI * 100}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-7xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-white print:text-black">
                                                    {results.score}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-10 text-center z-10">
                                            <div className="text-2xl font-bold text-white mb-2 print:text-black">
                                                {results.score >= 80 ? "Excellent Match" : results.score >= 60 ? "Good Potential" : "Needs Improvement"}
                                            </div>
                                            <p className="text-gray-500 text-sm">Based on {results.feedback.hardSkills.length} skills & keywords</p>
                                        </div>
                                    </div>

                                    {/* 2. Missing Keywords (Wide) */}
                                    <div className="md:col-span-2 lg:col-span-4 bg-black border border-white/5 rounded-xl p-8 print:border-gray-200 print:bg-white relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-50" />
                                        <h3 className="font-bold text-xl mb-6 flex items-center gap-3 text-white print:text-black">
                                            <AlertCircleIcon className="text-amber-500 text-2xl" /> Missing Keywords
                                        </h3>
                                        {results.feedback.missingKeywords.length > 0 ? (
                                            <div className="flex flex-wrap gap-3">
                                                {results.feedback.missingKeywords.map((kw, i) => (
                                                    <span key={i} className="px-4 py-2 bg-amber-500/5 hover:bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl text-sm font-semibold transition-colors cursor-default print:bg-amber-50 print:text-amber-700">
                                                        {kw}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-8">
                                                <div className="bg-green-500/10 p-4 rounded-full mb-3">
                                                    <CheckmarkCircle02Icon className="text-green-500 text-3xl" />
                                                </div>
                                                <p className="text-white/80">Perfect match! All key terms found.</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* 3. Hard Skills (Wide - Right) */}
                                    <div className="md:col-span-2 lg:col-span-2 md:row-span-1 bg-black border border-white/5 rounded-xl p-8 print:border-gray-200 print:bg-white relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50" />
                                        <h3 className="font-bold text-xl mb-6 text-white print:text-black flex items-center gap-2">
                                            <CodeIcon className="text-blue-500" />
                                            Skills
                                        </h3>
                                        {results.feedback.hardSkills.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {results.feedback.hardSkills.slice(0, 8).map((skill, i) => (
                                                    <span key={i} className="px-3 py-1 bg-blue-500/5 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-medium">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {results.feedback.hardSkills.length > 8 && (
                                                    <span className="px-3 py-1 bg-[#222] text-white/80 rounded-lg text-xs font-medium">
                                                        +{results.feedback.hardSkills.length - 8} more
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-sm italic">No skills detected.</p>
                                        )}
                                    </div>

                                    {/* 4. Experience & Readability (New Metrics) */}
                                    <div className="md:col-span-2 lg:col-span-2 bg-black border border-white/5 rounded-xl p-8 flex flex-col justify-between print:border-gray-200 print:bg-white">
                                        <div>
                                            <h3 className="font-bold text-lg mb-4 text-white print:text-black flex items-center gap-2">
                                                <BarChartIcon className="text-purple-500" /> Experience
                                            </h3>
                                            <div className="text-2xl font-bold text-white mb-1">{results.feedback.advanced.level}</div>
                                            <div className="text-xs text-gray-500 uppercase tracking-wider">Detected Level</div>
                                        </div>
                                        <div className="mt-6 pt-6 border-t border-white/5">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <div className="text-3xl font-bold text-white">{results.feedback.advanced.readingGrade}</div>
                                                    <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Grade Level</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xl font-bold text-gray-300">{results.feedback.advanced.readabilityScore}</div>
                                                    <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Readability</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    {/* 5. Formatting Stats (Clean Cards) */}
                                    <div className="md:col-span-2 lg:col-span-2 bg-black border border-white/5 rounded-xl p-8 flex flex-col justify-between print:border-gray-200 print:bg-white">
                                        <h3 className="font-bold text-lg mb-6 text-white print:text-black flex items-center gap-2">
                                            <Book01Icon className="text-pink-500" /> Structure
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-white/80 text-sm">Word Count</span>
                                                <span className={`font-bold ${results.feedback.formatting.find(f => f.msg.includes("Word"))?.status === 'good' ? 'text-green-400' : 'text-amber-400'}`}>
                                                    {results.feedback.formatting.find(f => f.msg.includes("Word"))?.val || 0} words
                                                </span>
                                            </div>
                                            <div className="w-full bg-[#222] h-2 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full"
                                                    style={{ width: `${Math.min((results.feedback.formatting.find(f => f.msg.includes("Word"))?.val || 0) / 10, 100)}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between items-center pt-2">
                                                <span className="text-white/80 text-sm">Completeness</span>
                                                <span className="font-bold text-white">{results.feedback.advanced.completeness}%</span>
                                            </div>
                                            <div className="w-full bg-[#222] h-2 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-blue-500 h-full rounded-full"
                                                    style={{ width: `${results.feedback.advanced.completeness}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 6. Essentials Checklist (Tall Right) */}
                                    <div className="md:col-span-2 lg:col-span-2 lg:row-span-2 bg-black border border-white/5 rounded-xl p-8 print:border-gray-200 print:bg-white">
                                        <h3 className="font-bold text-xl mb-6 text-white print:text-black flex items-center gap-2">
                                            <CheckmarkCircle02Icon className="text-green-500" /> Essentials
                                        </h3>
                                        <div className="space-y-3">
                                            {Object.entries(results.feedback.contactInfo).map(([key, valid]) => (
                                                <div key={key} className="flex items-center justify-between p-3.5 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                                    <span className="capitalize text-gray-300 print:text-black font-medium">{key}</span>
                                                    {valid ? (
                                                        <CheckmarkCircle02Icon className="text-green-500 text-xl" />
                                                    ) : (
                                                        <div className="w-2 h-2 bg-red-500 rounded-full" title="Missing" />
                                                    )}
                                                </div>
                                            ))}
                                            <div className="h-px bg-white/10 my-6" />
                                            <div className="space-y-4">
                                                {results.feedback.sections.map((sec, i) => (
                                                    <div key={i} className="flex items-center justify-between text-sm group">
                                                        <span className="text-white/80 capitalize group-hover:text-white transition-colors">{sec.name}</span>
                                                        {sec.found ? (
                                                            <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                                                        ) : (
                                                            <Cancel01Icon className="text-red-500 opacity-50" />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* 7. Fun / Tone Metrics (Wide Bottom) */}
                                    <div className="md:col-span-4 lg:col-span-4 bg-black border border-white/5 rounded-xl p-8 print:border-gray-200 print:bg-white flex flex-col md:flex-row gap-8 items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className="bg-white/5 p-4 rounded-full">
                                                <TimeScheduleIcon className="text-3xl text-gray-300" />
                                            </div>
                                            <div>
                                                <div className="text-white/80 text-sm font-medium mb-1">Human Read Time</div>
                                                <div className="text-3xl font-bold text-white print:text-black">
                                                    {((results.feedback.formatting.find(f => f.msg.includes("Word"))?.val || 0) / 200).toFixed(1)}m
                                                </div>
                                            </div>
                                        </div>
                                        <div className="h-12 w-px bg-white/10 hidden md:block" />
                                        <div className="flex items-center gap-6">
                                            <div>
                                                <div className="text-white/80 text-sm font-medium mb-1">Impact Score</div>
                                                <div className="text-3xl font-bold text-white print:text-black">
                                                    {results.feedback.impact.metricsCount} <span className="text-lg text-gray-500 font-normal">metrics</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="h-12 w-px bg-white/10 hidden md:block" />
                                        <div className="flex flex-col gap-1 text-right">
                                            <div className="text-white/80 text-sm font-medium">Tone Detector</div>
                                            <div className={`font-bold text-lg ${results.feedback.impact.actionVerbsCount > 5 ? "text-green-400" : "text-amber-400"}`}>
                                                {results.feedback.impact.actionVerbsCount > 5 ? "Action Oriented" : "Passive Voice"}
                                            </div>
                                        </div>
                                    </div>

                                    {/* 8. Soft Skills (Added to fill gap) */}
                                    <div className="md:col-span-2 lg:col-span-2 bg-black border border-white/5 rounded-xl p-8 print:border-gray-200 print:bg-white relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-50" />
                                        <h3 className="font-bold text-lg mb-6 text-white print:text-black flex items-center gap-2">
                                            Soft Skills
                                        </h3>
                                        {results.feedback.softSkills.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {results.feedback.softSkills.slice(0, 6).map((skill, i) => (
                                                    <span key={i} className="px-3 py-1 bg-purple-500/5 text-purple-400 border border-purple-500/20 rounded-lg text-xs font-medium">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-sm italic">No soft skills detected.</p>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
};

export default ATSCheckerPage;
