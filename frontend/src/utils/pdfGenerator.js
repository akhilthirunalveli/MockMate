import jsPDF from 'jspdf';

export const generateInterviewReportPDF = async (analysisData, options = {}) => {
  try {
    const {
      filename = `Interview_Analysis_Report_${new Date().toISOString().split('T')[0]}.pdf`,
      quality = 1.0,
      scale = 2
    } = options;

    // Create PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20; // Increased margin for better spacing
    const contentWidth = pageWidth - (margin * 2);
    let currentY = 25;

    // Color palette
    const colors = {
      primary: [0, 0, 0], // Black
      accent: [255, 255, 255], // White
      success: [34, 197, 94], // Green
      warning: [245, 158, 11], // Amber
      danger: [239, 68, 68], // Red
      text: [55, 65, 81], // Dark gray
      lightText: [107, 114, 128], // Light gray
      background: [249, 250, 251], // Very light gray
      cardBg: [255, 255, 255] // White
    };

    // Helper function to add text with word wrapping and proper spacing
    const addWrappedText = (text, x, y, maxWidth, lineHeight = 6, color = colors.text) => {
      pdf.setTextColor(...color);
      const lines = pdf.splitTextToSize(text, maxWidth);
      lines.forEach((line, index) => {
        pdf.text(line, x, y + (index * lineHeight));
      });
      return y + (lines.length * lineHeight);
    };

    // Helper function to add a new page if needed
    const checkPageBreak = (requiredHeight) => {
      if (currentY + requiredHeight > pageHeight - 30) {
        pdf.addPage();
        addPageBackground();
        addPageHeader();
        currentY = 50;
        return true;
      }
      return false;
    };

    // Helper function to add page background
    const addPageBackground = () => {
      pdf.setFillColor(...colors.background);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    };

    // Helper function to add page header for subsequent pages
    const addPageHeader = () => {
      if (pdf.internal.getCurrentPageInfo().pageNumber > 1) {
        // Add header for subsequent pages
        pdf.setFillColor(...colors.primary);
        pdf.rect(0, 0, pageWidth, 25, 'F');
        
        pdf.setFontSize(16);
        pdf.setTextColor(...colors.accent);
        pdf.setFont('helvetica', 'bold');
        pdf.text('MockMate', margin, 15);
        
        pdf.setFontSize(8);
        pdf.setTextColor(200, 200, 200);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Interview Analysis Report', margin + 60, 15);
      }
    };

    // Helper function to add section header with better spacing
    const addSectionHeader = (title, color = colors.primary) => {
      checkPageBreak(35);
      
      // Section background with more height
      pdf.setFillColor(245, 245, 245);
      pdf.roundedRect(margin, currentY, contentWidth, 15, 2, 2, 'F');
      
      // Section border
      pdf.setDrawColor(...color);
      pdf.setLineWidth(0.5);
      pdf.line(margin, currentY + 15, margin + contentWidth, currentY + 15);
      
      pdf.setFontSize(14);
      pdf.setTextColor(...color);
      pdf.setFont('helvetica', 'bold');
      pdf.text(title, margin + 5, currentY + 10);
      pdf.setFont('helvetica', 'normal');
      
      currentY += 25; // More spacing after header
    };

    // Helper function to create info card with better spacing
    const addInfoCard = (content, bgColor = colors.cardBg, borderColor = [220, 220, 220]) => {
      const cardHeight = Array.isArray(content) ? content.length * 8 + 20 : 30;
      checkPageBreak(cardHeight + 15);
      
      // Card background
      pdf.setFillColor(...bgColor);
      pdf.roundedRect(margin, currentY, contentWidth, cardHeight, 3, 3, 'F');
      
      // Card border
      pdf.setDrawColor(...borderColor);
      pdf.setLineWidth(0.3);
      pdf.roundedRect(margin, currentY, contentWidth, cardHeight, 3, 3, 'D');
      
      if (Array.isArray(content)) {
        content.forEach((item, index) => {
          pdf.setFontSize(10);
          pdf.setTextColor(...colors.text);
          if (typeof item === 'object') {
            pdf.setTextColor(...(item.color || colors.text));
            pdf.text(item.text, margin + 8, currentY + 15 + (index * 8));
          } else {
            pdf.text(item, margin + 8, currentY + 15 + (index * 8));
          }
        });
      }
      
      currentY += cardHeight + 15; // More spacing after card
      return currentY - 15;
    };

    // Helper function to create progress bar with better spacing
    const addProgressBar = (label, score, x, y, width = 120) => {
      const barHeight = 6;
      const fillWidth = (score / 10) * width;
      
      // Label
      pdf.setFontSize(11);
      pdf.setTextColor(...colors.text);
      pdf.text(label, x, y);
      
      // Background bar
      pdf.setFillColor(235, 235, 235);
      pdf.roundedRect(x, y + 3, width, barHeight, 2, 2, 'F');
      
      // Progress fill
      const color = score >= 7 ? colors.success : score >= 5 ? colors.warning : colors.danger;
      pdf.setFillColor(...color);
      if (fillWidth > 0) {
        pdf.roundedRect(x, y + 3, fillWidth, barHeight, 2, 2, 'F');
      }
      
      // Score text
      pdf.setFontSize(10);
      pdf.setTextColor(...colors.text);
      pdf.text(`${score.toFixed(1)}/10`, x + width + 5, y + 7);
    };

    // Set initial background
    addPageBackground();

    // Main Header Section with better spacing
    pdf.setFillColor(...colors.primary);
    pdf.rect(0, 0, pageWidth, 35, 'F');
    
    // MockMate branding (text-based like navbar)
    pdf.setFontSize(22);
    pdf.setTextColor(...colors.accent);
    pdf.setFont('helvetica', 'bold');
    pdf.text('MockMate', margin, 18);
    
    pdf.setFontSize(10);
    pdf.setTextColor(200, 200, 200);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Interview Analysis Report', margin, 26);
    
    // Report info on the right (no time)
    pdf.setFontSize(9);
    pdf.setTextColor(...colors.accent);
    pdf.text(`${analysisData.metadata.generatedDate.split(' ')[0]}`, pageWidth - 60, 18);
    pdf.text(`ID: ${analysisData.metadata.sessionId.substring(0, 8)}`, pageWidth - 60, 24);

    currentY = 45;

    // Performance Overview Section
    addSectionHeader('PERFORMANCE OVERVIEW');
    
    // Score card with better layout
    const scoreCardHeight = 50;
    checkPageBreak(scoreCardHeight + 15);
    
    // Gradient background for score card
    pdf.setFillColor(248, 250, 252);
    pdf.roundedRect(margin, currentY, contentWidth, scoreCardHeight, 5, 5, 'F');
    
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.5);
    pdf.roundedRect(margin, currentY, contentWidth, scoreCardHeight, 5, 5, 'D');
    
    // Large score display
    pdf.setFontSize(42);
    const scoreColor = analysisData.analysis.overallScore >= 8 ? colors.success : 
                       analysisData.analysis.overallScore >= 6 ? colors.warning : colors.danger;
    pdf.setTextColor(...scoreColor);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${analysisData.analysis.overallScore}`, margin + 20, currentY + 32);
    pdf.setFont('helvetica', 'normal');
    
    pdf.setFontSize(16);
    pdf.setTextColor(...colors.text);
    pdf.text('/10', margin + 50, currentY + 32);
    
    // Grade and performance info
    pdf.setFontSize(16);
    pdf.setTextColor(...colors.primary);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Grade: ${analysisData.analysis.grade}`, margin + 85, currentY + 20);
    
    pdf.setFontSize(12);
    pdf.setTextColor(...colors.text);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Performance Level: ${analysisData.analysis.performance}`, margin + 85, currentY + 32);
    
    currentY += scoreCardHeight + 20;

    // Skills Assessment Section
    addSectionHeader('SKILLS ASSESSMENT');
    
    const skillsCardHeight = 80;
    checkPageBreak(skillsCardHeight + 15);
    
    pdf.setFillColor(...colors.cardBg);
    pdf.roundedRect(margin, currentY, contentWidth, skillsCardHeight, 3, 3, 'F');
    pdf.setDrawColor(220, 220, 220);
    pdf.roundedRect(margin, currentY, contentWidth, skillsCardHeight, 3, 3, 'D');

    const skills = [
      { name: 'Clarity', score: analysisData.metrics.clarity },
      { name: 'Structure', score: analysisData.metrics.structure },
      { name: 'Confidence', score: analysisData.metrics.confidence },
      { name: 'Relevance', score: analysisData.metrics.relevance }
    ];

    skills.forEach((skill, index) => {
      const skillY = currentY + 15 + (index * 15);
      addProgressBar(skill.name, skill.score, margin + 10, skillY, 130);
    });
    
    currentY += skillsCardHeight + 20;

    // Interview Details Section
    addSectionHeader('INTERVIEW DETAILS');
    
    // Question subsection
    pdf.setFontSize(12);
    pdf.setTextColor(...colors.text);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Question Asked:', margin, currentY);
    pdf.setFont('helvetica', 'normal');
    currentY += 10;
    
    checkPageBreak(35);
    pdf.setFillColor(245, 245, 245);
    const questionHeight = Math.max(30, Math.ceil(analysisData.interview.question.length / 80) * 6 + 15);
    pdf.roundedRect(margin, currentY, contentWidth, questionHeight, 3, 3, 'F');
    
    pdf.setFontSize(10);
    pdf.setTextColor(...colors.text);
    currentY = addWrappedText(analysisData.interview.question, margin + 8, currentY + 10, contentWidth - 16, 6);
    currentY += 20;

    // Statistics with better spacing
    const statsInfo = [
      `Words Spoken: ${analysisData.interview.wordCount}`,
      `Estimated Duration: ${analysisData.interview.estimatedDuration} minutes`,
      `Average Speaking Rate: ${Math.round(analysisData.interview.wordCount / analysisData.interview.estimatedDuration)} words per minute`,
      `Response Quality: ${analysisData.analysis.performance}`
    ];
    
    addInfoCard(statsInfo, [248, 250, 252]);

    // Enhanced Response Section
    if (analysisData.analysis.refinedAnswer) {
      addSectionHeader('ENHANCED RESPONSE');
      
      checkPageBreak(45);
      pdf.setFillColor(240, 248, 255);
      const responseHeight = Math.max(35, Math.ceil(analysisData.analysis.refinedAnswer.length / 70) * 6 + 20);
      pdf.roundedRect(margin, currentY, contentWidth, responseHeight, 3, 3, 'F');
      pdf.setDrawColor(59, 130, 246);
      pdf.roundedRect(margin, currentY, contentWidth, responseHeight, 3, 3, 'D');
      
      pdf.setFontSize(10);
      pdf.setTextColor(...colors.text);
      currentY = addWrappedText(analysisData.analysis.refinedAnswer, margin + 8, currentY + 10, contentWidth - 16, 6);
      currentY += 25;
    }

    // Strengths Section
    if (analysisData.analysis.strengths && analysisData.analysis.strengths.length > 0) {
      addSectionHeader('KEY STRENGTHS');
      
      const strengthsContent = analysisData.analysis.strengths.map(strength => `• ${strength}`);
      addInfoCard(strengthsContent, [240, 253, 244], colors.success);
    }

    // Areas for Improvement Section
    if (analysisData.analysis.improvements && analysisData.analysis.improvements.length > 0) {
      addSectionHeader('AREAS FOR IMPROVEMENT');
      
      const improvementsContent = analysisData.analysis.improvements.map(improvement => `• ${improvement}`);
      addInfoCard(improvementsContent, [255, 251, 235], colors.warning);
    }

    // Key Takeaways Section
    if (analysisData.analysis.keyTakeaways && analysisData.analysis.keyTakeaways.length > 0) {
      addSectionHeader('KEY TAKEAWAYS');
      
      const takeawaysContent = analysisData.analysis.keyTakeaways.map((takeaway, index) => `${index + 1}. ${takeaway}`);
      addInfoCard(takeawaysContent, [249, 250, 251]);
    }

    // Overall Feedback Section
    if (analysisData.analysis.overallFeedback) {
      addSectionHeader('OVERALL FEEDBACK');
      
      checkPageBreak(50);
      pdf.setFillColor(249, 250, 251);
      const feedbackHeight = Math.max(40, Math.ceil(analysisData.analysis.overallFeedback.length / 70) * 6 + 25);
      pdf.roundedRect(margin, currentY, contentWidth, feedbackHeight, 3, 3, 'F');
      pdf.setDrawColor(200, 200, 200);
      pdf.roundedRect(margin, currentY, contentWidth, feedbackHeight, 3, 3, 'D');
      
      // Quote styling
      pdf.setFontSize(24);
      pdf.setTextColor(180, 180, 180);
      pdf.text('"', margin + 8, currentY + 20);
      
      pdf.setFontSize(11);
      pdf.setTextColor(...colors.text);
      pdf.setFont('helvetica', 'italic');
      currentY = addWrappedText(analysisData.analysis.overallFeedback, margin + 15, currentY + 15, contentWidth - 30, 6);
      pdf.setFont('helvetica', 'normal');
      
      pdf.setFontSize(24);
      pdf.setTextColor(180, 180, 180);
      pdf.text('"', contentWidth + margin - 15, currentY + 10);
      
      currentY += 25;
    }

    // Footer for all pages
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      
      // Footer background
      pdf.setFillColor(...colors.primary);
      pdf.rect(0, pageHeight - 15, pageWidth, 15, 'F');
      
      // Footer content
      pdf.setFontSize(9);
      pdf.setTextColor(...colors.accent);
      pdf.text('MockMate', margin, pageHeight - 7);
      
      pdf.setTextColor(200, 200, 200);
      pdf.text('AI Interview Coach - Professional Analysis Report', margin + 35, pageHeight - 7);
      
      pdf.setTextColor(...colors.accent);
      pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 35, pageHeight - 7);
    }

    // Save the PDF
    pdf.save(filename);
    
    return {
      success: true,
      filename,
      message: 'Professional PDF report generated successfully!'
    };

  } catch (error) {
    console.error('Error generating PDF:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to generate PDF report'
    };
  }
};
