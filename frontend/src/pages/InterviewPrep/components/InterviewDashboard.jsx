import React, { useRef, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import { generateInterviewReportPDF } from '../../../utils/pdfGenerator.js';
import axiosInstance from '../../../utils/axiosInstance.js';
import { API_PATHS } from '../../../constants/apiPaths';
import toast from 'react-hot-toast';
import { 
  ChartBarIcon, 
  DocumentTextIcon, 
  ChartPieIcon,
  LightBulbIcon,
  StarIcon,
  TrophyIcon,
  AcademicCapIcon,
  ClockIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const InterviewDashboard = ({ analysis, currentQuestion, transcript }) => {
  const dashboardRef = useRef(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  if (!analysis) return null;

  // Prepare data for charts with better color palette
  const scoreData = [
    { name: 'Your Score', value: analysis.score, fill: '#6366F1' },
    { name: 'Remaining', value: 10 - analysis.score, fill: '#1E293B' }
  ];

  const skillsData = [
    { skill: 'Clarity', score: Math.min(analysis.score + Math.random() * 2, 10) },
    { skill: 'Structure', score: Math.min(analysis.score + Math.random() * 1.5, 10) },
    { skill: 'Confidence', score: Math.min(analysis.score + Math.random() * 1, 10) },
    { skill: 'Relevance', score: Math.min(analysis.score + Math.random() * 0.5, 10) }
  ];

  const performanceData = [
    { name: 'Performance', value: (analysis.score / 10) * 100, fill: getScoreColor(analysis.score) }
  ];

  function getScoreColor(score) {
    if (score >= 8) return '#10B981'; // Emerald
    if (score >= 6) return '#F59E0B'; // Amber  
    if (score >= 4) return '#F97316'; // Orange
    return '#EF4444'; // Red
  }

  function getScoreGrade(score) {
    if (score >= 9) return 'A+';
    if (score >= 8) return 'A';
    if (score >= 7) return 'B+';
    if (score >= 6) return 'B';
    if (score >= 5) return 'C+';
    if (score >= 4) return 'C';
    return 'D';
  }

  function getScoreLabel(score) {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Fair';
    return 'Needs Improvement';
  }

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    const loadingToast = toast.loading('Generating PDF report...');

    try {
      // Generate detailed PDF report
      const response = await axiosInstance.post(API_PATHS.AI.GENERATE_PDF_DATA, {
        analysis,
        question: currentQuestion,
        transcript,
        userInfo: {
          name: localStorage.getItem('userName') || 'Anonymous',
          role: localStorage.getItem('userRole') || 'N/A'
        }
      });

      if (response.data.success) {
        const result = await generateInterviewReportPDF(response.data.data);
        if (result.success) {
          toast.success('PDF report downloaded successfully!');
        } else {
          throw new Error(result.message);
        }
      } else {
        throw new Error('Failed to generate PDF data');
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error(error.message || 'Failed to generate PDF report');
    } finally {
      setIsGeneratingPDF(false);
      toast.dismiss(loadingToast);
    }
  };

  return (
    <div ref={dashboardRef} data-dashboard className="space-y-8">
      {/* Header Section with Black Theme */}
      <div className="bg-black border border-gray-700 rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <ChartBarIcon className="w-7 h-7 text-black" />
            </div>
            <div>
              <h3 className="text-white font-bold text-xl tracking-wide">Performance Analysis</h3>
              <p className="text-gray-400 text-sm">AI-powered assessment • Real-time insights</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className={`text-4xl font-bold tracking-wider ${getScoreColor(analysis.score) === '#10B981' ? 'text-green-400' : 
                                getScoreColor(analysis.score) === '#F59E0B' ? 'text-yellow-400' : 
                                getScoreColor(analysis.score) === '#F97316' ? 'text-orange-400' : 'text-red-400'}`}>
                {getScoreGrade(analysis.score)}
              </div>
              <div className="text-gray-400 text-sm font-medium">{getScoreLabel(analysis.score)}</div>
            </div>
            
            {/* PDF Download Button */}
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="bg-white hover:bg-gray-100 disabled:bg-gray-300 disabled:opacity-50 text-black px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-white/10 border border-gray-200"
            >
              {isGeneratingPDF ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                <>
                  <DocumentTextIcon className="w-5 h-5" />
                  Download Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Overall Score Chart */}
        <div className="bg-black border border-gray-700 rounded-2xl p-7 shadow-xl">
          <h4 className="text-white font-semibold mb-6 flex items-center gap-3">
            <div className="w-2 h-6 bg-white rounded-full"></div>
            Overall Score
          </h4>
          <div className="h-36 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="65%" outerRadius="90%" data={performanceData}>
                <RadialBar dataKey="value" cornerRadius={12} fill={getScoreColor(analysis.score)} />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-white font-bold text-xl">
                  {analysis.score}/10
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skills Breakdown */}
        <div className="bg-black border border-gray-700 rounded-2xl p-7 shadow-xl">
          <h4 className="text-white font-semibold mb-6 flex items-center gap-3">
            <div className="w-2 h-6 bg-white rounded-full"></div>
            Skills Assessment
          </h4>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillsData}>
                <XAxis dataKey="skill" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <Bar dataKey="score" fill="#FFFFFF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-black border border-gray-700 rounded-2xl p-7 shadow-xl">
          <h4 className="text-white font-semibold mb-6 flex items-center gap-3">
            <div className="w-2 h-6 bg-white rounded-full"></div>
            Session Metrics
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400 text-sm flex items-center gap-3">
                <ChatBubbleLeftRightIcon className="w-4 h-4 text-gray-500" />
                Words spoken
              </span>
              <span className="text-white font-semibold">{transcript.split(' ').length}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400 text-sm flex items-center gap-3">
                <ClockIcon className="w-4 h-4 text-gray-500" />
                Speaking time
              </span>
              <span className="text-white font-semibold">~{Math.ceil(transcript.split(' ').length / 150)}min</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400 text-sm flex items-center gap-3">
                <UserIcon className="w-4 h-4 text-gray-500" />
                Confidence level
              </span>
              <span className={`font-semibold ${analysis.score >= 7 ? 'text-green-400' : analysis.score >= 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                {analysis.score >= 7 ? 'High' : analysis.score >= 5 ? 'Medium' : 'Low'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400 text-sm flex items-center gap-3">
                <LightBulbIcon className="w-4 h-4 text-gray-500" />
                Areas identified
              </span>
              <span className="text-white font-semibold">{analysis.improvements?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analysis Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Refined Answer */}
        <div className="bg-black border border-gray-700 rounded-2xl p-7 shadow-xl">
          <h4 className="text-white font-semibold mb-5 flex items-center gap-3">
            <div className="w-2 h-6 bg-white rounded-full"></div>
            Enhanced Response
          </h4>
          <div className="bg-gray-900 p-6 rounded-xl border-l-4 border-white">
            <p className="text-gray-200 leading-relaxed text-sm font-light">{analysis.refinedAnswer}</p>
          </div>
        </div>

        {/* Strengths & Improvements */}
        <div className="space-y-6">
          {/* Strengths */}
          {analysis.strengths && analysis.strengths.length > 0 && (
            <div className="bg-black border border-gray-700 rounded-2xl p-7 shadow-xl">
              <h4 className="text-white font-semibold mb-5 flex items-center gap-3">
                <div className="w-2 h-6 bg-green-400 rounded-full"></div>
                What You Nailed
              </h4>
              <div className="space-y-3">
                {analysis.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-green-300 text-sm leading-relaxed">{strength}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Improvements */}
          {analysis.improvements && analysis.improvements.length > 0 && (
            <div className="bg-black border border-gray-700 rounded-2xl p-7 shadow-xl">
              <h4 className="text-white font-semibold mb-5 flex items-center gap-3">
                <div className="w-2 h-6 bg-yellow-400 rounded-full"></div>
                Growth Opportunities
              </h4>
              <div className="space-y-3">
                {analysis.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-yellow-300 text-sm leading-relaxed">{improvement}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Key Takeaways */}
      {analysis.keyTakeaways && analysis.keyTakeaways.length > 0 && (
        <div className="bg-black border border-gray-700 rounded-2xl p-8 shadow-xl">
          <h4 className="text-white font-semibold mb-6 flex items-center gap-3">
            <div className="w-2 h-6 bg-white rounded-full"></div>
            Key Insights & Takeaways
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analysis.keyTakeaways.map((takeaway, index) => (
              <div key={index} className="bg-gray-900 p-6 rounded-xl border border-gray-600 hover:border-gray-400 transition-colors duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-black text-sm font-bold">{index + 1}</span>
                  </div>
                  <span className="text-white text-sm leading-relaxed font-light">{takeaway}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overall Feedback */}
      {analysis.overallFeedback && (
        <div className="bg-black border border-gray-700 rounded-2xl p-8 shadow-xl">
          <h4 className="text-white font-semibold mb-6 flex items-center gap-3">
            <div className="w-2 h-6 bg-white rounded-full"></div>
            Coach's Summary
          </h4>
          <div className="bg-gray-900 p-6 rounded-xl border-l-4 border-white">
            <p className="text-gray-200 text-sm leading-relaxed italic font-light">"{analysis.overallFeedback}"</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewDashboard;
