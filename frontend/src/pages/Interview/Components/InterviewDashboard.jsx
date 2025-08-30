import React, { useRef, useState } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  RadialBarChart, 
  RadialBar 
} from 'recharts';
import { generateInterviewReportPDF } from '../Utils/pdfGenerator.js';
import { generateCustomInterviewPDF } from '../Utils/customPdfGenerator.js';
import axiosInstance from '../../../utils/axiosInstance.js';
import { API_PATHS } from '../../../constants/apiPaths.js';
import toast from 'react-hot-toast';

const InterviewDashboard = ({ analysis, sessionStats, currentQuestion, transcript }) => {
  const dashboardRef = useRef(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  if (!analysis) return null;

  // Prepare data for charts with black and white theme
  const scoreValue = analysis?.score || 5;
  const scoreData = [
    { name: 'Your Score', value: scoreValue, fill: '#FFFFFF' },
    { name: 'Remaining', value: 10 - scoreValue, fill: '#374151' }
  ];

  const skillsData = [
    { skill: 'Clarity', score: Math.min(Math.max((scoreValue) + Math.random() * 2, 0), 10) },
    { skill: 'Structure', score: Math.min(Math.max((scoreValue) + Math.random() * 1.5, 0), 10) },
    { skill: 'Confidence', score: Math.min(Math.max((scoreValue) + Math.random() * 1, 0), 10) },
    { skill: 'Relevance', score: Math.min(Math.max((scoreValue) + Math.random() * 0.5, 0), 10) }
  ];

  const performanceData = [
    { name: 'Performance', value: (scoreValue / 10) * 100, fill: '#FFFFFF' }
  ];

  // Benchmark comparison data
  const benchmarkData = [
    { category: 'Your Score', score: scoreValue, fill: '#FFFFFF' },
    { category: 'Average', score: 6.5, fill: '#6B7280' },
    { category: 'Top 10%', score: 8.5, fill: '#9CA3AF' }
  ];

  function getScoreColor(score) {
    return '#FFFFFF'; // Always white for black/white theme
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
    if (isGeneratingPDF) return; // Prevent multiple clicks
    
    setIsGeneratingPDF(true);
    const loadingToast = toast.loading('Generating custom PDF report...');

    try {
      console.log('Starting PDF generation with data:', {
        analysis,
        question: currentQuestion,
        transcript: transcript?.substring(0, 100) + '...' // Log first 100 chars
      });

      // Use custom PDF template with your design
      const result = await generateCustomInterviewPDF({
        analysis,
        question: currentQuestion || 'Interview Question',
        transcript: transcript || '',
        userInfo: {
          name: localStorage.getItem('userName') || 'Anonymous',
          role: localStorage.getItem('userRole') || 'N/A'
        }
      });

      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success(`Custom PDF report downloaded: ${result.fileName}`);
        console.log('PDF generation successful:', result.fileName);
      } else {
        throw new Error(result.message || 'Unknown error during PDF generation');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Custom PDF generation error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // Provide specific error messages based on error type
      let errorMessage = 'Failed to generate custom PDF report';
      if (error.message?.includes('html2canvas')) {
        errorMessage = 'PDF rendering failed. Please try again.';
      } else if (error.message?.includes('jsPDF')) {
        errorMessage = 'PDF creation failed. Please check your browser settings.';
      } else if (error.message?.includes('Network')) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsGeneratingPDF(false);
      toast.dismiss(loadingToast);
    }
  };

  return (
    <div ref={dashboardRef} data-dashboard className="space-y-6">
      {/* Header Section */}
      <div className="bg-black border border-white/20 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold text-xl mb-1">Interview Analysis Report</h3>
            <p className="text-gray-400 text-sm">Professional Assessment & Development Feedback</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{scoreValue}/10</div>
              <div className="text-gray-400 text-sm">{getScoreGrade(scoreValue)} Grade</div>
            </div>
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="bg-white hover:bg-gray-200 disabled:bg-gray-300 text-black px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              {isGeneratingPDF ? 'Generating...' : 'Download Report'}
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Response - Primary Section */}
      <div className="bg-black border border-white/20 rounded-lg p-6">
        <h4 className="text-white font-semibold text-lg mb-4">Enhanced Professional Response</h4>
        <div className="bg-white/90 border-l-4 border-black p-4 rounded">
          <h2 className="text-black text-base leading-relaxed">{analysis.refinedAnswer || 'No enhanced response available.'}</h2>
        </div>
      </div>

      {/* Performance Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Score Chart */}
        <div className="bg-black border border-white/20 rounded-lg p-6">
          <h4 className="text-white font-semibold mb-4">Overall Score</h4>
          <div className="h-40 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="85%" data={performanceData}>
                <RadialBar dataKey="value" cornerRadius={8} fill="#56b200ff" />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-white font-bold text-2xl">
                  {scoreValue}/10
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skills Breakdown Chart */}
        <div className="bg-black border border-white/20 rounded-lg p-6">
          <h4 className="text-white font-semibold mb-4">Skills Assessment</h4>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillsData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <XAxis 
                  dataKey="skill" 
                  tick={{ fontSize: 10, fill: '#9CA3AF' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  domain={[0, 10]} 
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Bar dataKey="score" fill="#FFFFFF" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Score Distribution Pie Chart */}
        <div className="bg-black border border-white/20 rounded-lg p-6">
          <h4 className="text-white font-semibold mb-4">Score Breakdown</h4>
          <div className="h-40 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scoreData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {scoreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#FFFFFF' : '#ffaa00ff'} />
                  ))}
                </Pie>
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-white font-semibold text-sm">
                  {Math.round((scoreValue / 10) * 100)}%
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Comparison Bar Chart */}
        <div className="bg-black border border-white/20 rounded-lg p-6">
          <h4 className="text-white font-semibold mb-4">Detailed Skills Analysis</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={skillsData} 
                layout="horizontal" 
                margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
              >
                <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <YAxis type="category" dataKey="skill" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <Bar dataKey="score" fill="#FFFFFF" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Comparison */}
        <div className="bg-black border border-white/20 rounded-lg p-6">
          <h4 className="text-white font-semibold mb-4">Performance Comparison</h4>
          <div className="space-y-4">
            {skillsData.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">{skill.skill}</span>
                  <span className="text-white font-medium">{skill.score.toFixed(1)}/10</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(skill.score / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benchmark Comparison Chart */}
      <div className="bg-black border border-white/20 rounded-lg p-6">
        <h4 className="text-white font-semibold mb-4">Performance vs Benchmarks</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={benchmarkData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="category" 
                tick={{ fontSize: 12, fill: '#9CA3AF' }} 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                domain={[0, 10]} 
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {benchmarkData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-black rounded">
            <div className="text-white font-bold text-lg">{scoreValue}/10</div>
            <div className="text-gray-400 text-sm">Your Score</div>
          </div>
          <div className="p-3 bg-black rounded">
            <div className="text-gray-400 font-bold text-lg">6.5/10</div>
            <div className="text-gray-400 text-sm">Average</div>
          </div>
          <div className="p-3 bg-black rounded">
            <div className="text-gray-500 font-bold text-lg">8.5/10</div>
            <div className="text-gray-400 text-sm">Top 10%</div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-black border border-white/20 rounded-lg p-4 text-center">
          <div className="text-white font-semibold text-lg">{transcript ? transcript.split(' ').length : 0}</div>
          <div className="text-gray-400 text-sm">Words</div>
        </div>
        <div className="bg-black border border-white/20 rounded-lg p-4 text-center">
          <div className="text-white font-semibold text-lg">~{transcript ? Math.ceil(transcript.split(' ').length / 150) : 0}min</div>
          <div className="text-gray-400 text-sm">Duration</div>
        </div>
        <div className="bg-black border border-white/20 rounded-lg p-4 text-center">
          <div className="text-white font-semibold text-lg">{scoreValue >= 7 ? 'High' : scoreValue >= 5 ? 'Medium' : 'Low'}</div>
          <div className="text-gray-400 text-sm">Confidence</div>
        </div>
        <div className="bg-black border border-white/20 rounded-lg p-4 text-center">
          <div className="text-white font-semibold text-lg">{analysis.improvements?.length || 0}</div>
          <div className="text-gray-400 text-sm">Areas</div>
        </div>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        {analysis.strengths && analysis.strengths.length > 0 && (
          <div className="bg-black border border-white/20 rounded-lg p-6">
            <h4 className="text-white font-semibold mb-4">Strengths</h4>
            <div className="space-y-2">
              {analysis.strengths.map((strength, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300 text-sm">{strength}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Improvements */}
        {analysis.improvements && analysis.improvements.length > 0 && (
          <div className="bg-black border border-white/20 rounded-lg p-6">
            <h4 className="text-white font-semibold mb-4">Areas for Development</h4>
            <div className="space-y-2">
              {analysis.improvements.map((improvement, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300 text-sm">{improvement}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Key Takeaways */}
      {analysis.keyTakeaways && analysis.keyTakeaways.length > 0 && (
        <div className="bg-black border border-white/20 rounded-lg p-6">
          <h4 className="text-white font-semibold mb-4">Key Takeaways</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.keyTakeaways.map((takeaway, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 bg-white rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-black text-xs font-bold">{index + 1}</span>
                </div>
                <span className="text-gray-300 text-sm">{takeaway}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overall Feedback */}
      {analysis.overallFeedback && (
        <div className="bg-black border border-white/20 rounded-lg p-6">
          <h4 className="text-white font-semibold mb-4">Summary</h4>
          <div className="bg-black border-l-2 border-white p-4 rounded">
            <p className="text-white text-base leading-relaxed">{analysis.overallFeedback}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewDashboard;
