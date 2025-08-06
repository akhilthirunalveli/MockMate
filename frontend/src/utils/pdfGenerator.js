import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
    let currentY = 20;

    // Helper function to add text with word wrapping
    const addWrappedText = (text, x, y, maxWidth, lineHeight = 6) => {
      const lines = pdf.splitTextToSize(text, maxWidth);
      pdf.text(lines, x, y);
      return y + (lines.length * lineHeight);
    };

    // Helper function to add a new page if needed
    const checkPageBreak = (requiredHeight) => {
      if (currentY + requiredHeight > pageHeight - 20) {
        pdf.addPage();
        currentY = 20;
        return true;
      }
      return false;
    };

    // Set font
    pdf.setFont('helvetica');

    // Header Section
    pdf.setFontSize(24);
    pdf.setTextColor(59, 130, 246); // Blue color
    pdf.text('Interview Analysis Report', 20, currentY);
    currentY += 15;

    // Metadata
    pdf.setFontSize(12);
    pdf.setTextColor(107, 114, 128); // Gray color
    pdf.text(`Generated: ${analysisData.metadata.generatedDate}`, 20, currentY);
    currentY += 6;
    pdf.text(`Candidate: ${analysisData.metadata.candidate}`, 20, currentY);
    currentY += 6;
    if (analysisData.metadata.role !== 'N/A') {
      pdf.text(`Role: ${analysisData.metadata.role}`, 20, currentY);
      currentY += 6;
    }
    currentY += 10;

    // Overall Score Section
    checkPageBreak(30);
    pdf.setFontSize(18);
    pdf.setTextColor(34, 197, 94); // Green color
    pdf.text('Overall Performance', 20, currentY);
    currentY += 10;

    // Score box
    pdf.setDrawColor(59, 130, 246);
    pdf.setLineWidth(0.5);
    pdf.rect(20, currentY, 50, 25);
    
    pdf.setFontSize(24);
    pdf.setTextColor(59, 130, 246);
    pdf.text(`${analysisData.analysis.overallScore}/10`, 30, currentY + 12);
    
    pdf.setFontSize(14);
    pdf.text(`Grade: ${analysisData.analysis.grade}`, 30, currentY + 20);

    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Performance Level: ${analysisData.analysis.performance}`, 80, currentY + 8);
    
    currentY += 35;

    // Interview Details Section
    checkPageBreak(40);
    pdf.setFontSize(16);
    pdf.setTextColor(147, 51, 234); // Purple color
    pdf.text('Interview Details', 20, currentY);
    currentY += 10;

    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Question:', 20, currentY);
    currentY += 6;
    currentY = addWrappedText(analysisData.interview.question, 20, currentY, pageWidth - 40);
    currentY += 6;

    pdf.text(`Word Count: ${analysisData.interview.wordCount} words`, 20, currentY);
    currentY += 6;
    pdf.text(`Estimated Duration: ${analysisData.interview.estimatedDuration} minutes`, 20, currentY);
    currentY += 15;

    // Skills Breakdown Section
    checkPageBreak(50);
    pdf.setFontSize(16);
    pdf.setTextColor(245, 158, 11); // Orange color
    pdf.text('Skills Assessment', 20, currentY);
    currentY += 12;

    const skills = [
      { name: 'Clarity', score: analysisData.metrics.clarity },
      { name: 'Structure', score: analysisData.metrics.structure },
      { name: 'Confidence', score: analysisData.metrics.confidence },
      { name: 'Relevance', score: analysisData.metrics.relevance }
    ];

    skills.forEach((skill, index) => {
      checkPageBreak(8);
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`${skill.name}:`, 25, currentY);
      
      // Progress bar
      const barWidth = 60;
      const barHeight = 4;
      const fillWidth = (skill.score / 10) * barWidth;
      
      // Background bar
      pdf.setFillColor(229, 231, 235); // Light gray
      pdf.rect(70, currentY - 3, barWidth, barHeight, 'F');
      
      // Progress fill
      const color = skill.score >= 7 ? [34, 197, 94] : skill.score >= 5 ? [245, 158, 11] : [239, 68, 68];
      pdf.setFillColor(...color);
      pdf.rect(70, currentY - 3, fillWidth, barHeight, 'F');
      
      pdf.text(`${skill.score.toFixed(1)}/10`, 140, currentY);
      currentY += 8;
    });
    currentY += 10;

    // Enhanced Response Section
    if (analysisData.analysis.refinedAnswer) {
      checkPageBreak(30);
      pdf.setFontSize(16);
      pdf.setTextColor(59, 130, 246); // Blue color
      pdf.text('Enhanced Response', 20, currentY);
      currentY += 10;

      pdf.setFontSize(10);
      pdf.setTextColor(55, 65, 81); // Dark gray
      currentY = addWrappedText(analysisData.analysis.refinedAnswer, 20, currentY, pageWidth - 40, 5);
      currentY += 15;
    }

    // Strengths Section
    if (analysisData.analysis.strengths && analysisData.analysis.strengths.length > 0) {
      checkPageBreak(30);
      pdf.setFontSize(16);
      pdf.setTextColor(34, 197, 94); // Green color
      pdf.text('Key Strengths', 20, currentY);
      currentY += 10;

      analysisData.analysis.strengths.forEach((strength, index) => {
        checkPageBreak(8);
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        pdf.text('•', 25, currentY);
        currentY = addWrappedText(strength, 30, currentY, pageWidth - 50, 5);
        currentY += 3;
      });
      currentY += 10;
    }

    // Areas for Improvement Section
    if (analysisData.analysis.improvements && analysisData.analysis.improvements.length > 0) {
      checkPageBreak(30);
      pdf.setFontSize(16);
      pdf.setTextColor(245, 158, 11); // Orange color
      pdf.text('Areas for Improvement', 20, currentY);
      currentY += 10;

      analysisData.analysis.improvements.forEach((improvement, index) => {
        checkPageBreak(8);
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        pdf.text('•', 25, currentY);
        currentY = addWrappedText(improvement, 30, currentY, pageWidth - 50, 5);
        currentY += 3;
      });
      currentY += 10;
    }

    // Key Takeaways Section
    if (analysisData.analysis.keyTakeaways && analysisData.analysis.keyTakeaways.length > 0) {
      checkPageBreak(30);
      pdf.setFontSize(16);
      pdf.setTextColor(147, 51, 234); // Purple color
      pdf.text('Key Takeaways', 20, currentY);
      currentY += 10;

      analysisData.analysis.keyTakeaways.forEach((takeaway, index) => {
        checkPageBreak(8);
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`${index + 1}.`, 25, currentY);
        currentY = addWrappedText(takeaway, 32, currentY, pageWidth - 52, 5);
        currentY += 3;
      });
      currentY += 10;
    }

    // Overall Feedback Section
    if (analysisData.analysis.overallFeedback) {
      checkPageBreak(30);
      pdf.setFontSize(16);
      pdf.setTextColor(107, 114, 128); // Gray color
      pdf.text('Coach\'s Summary', 20, currentY);
      currentY += 10;

      pdf.setFontSize(10);
      pdf.setTextColor(55, 65, 81); // Dark gray
      pdf.setFont('helvetica', 'italic');
      currentY = addWrappedText(`"${analysisData.analysis.overallFeedback}"`, 20, currentY, pageWidth - 40, 5);
      pdf.setFont('helvetica', 'normal');
      currentY += 15;
    }

    // Footer
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(156, 163, 175); // Light gray
      pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 30, pageHeight - 10);
      pdf.text('Generated by MockMate - AI Interview Coach', 20, pageHeight - 10);
    }

    // Save the PDF
    pdf.save(filename);
    
    return {
      success: true,
      filename,
      message: 'PDF report generated successfully!'
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

export const generateDashboardScreenshotPDF = async (dashboardElement, options = {}) => {
  try {
    const {
      filename = `Interview_Dashboard_${new Date().toISOString().split('T')[0]}.pdf`,
      quality = 1.0,
      scale = 2
    } = options;

    // Generate canvas from dashboard element
    const canvas = await html2canvas(dashboardElement, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#111827', // Dark background
      onclone: (clonedDoc) => {
        // Ensure all styles are applied
        const clonedElement = clonedDoc.querySelector('[data-dashboard]');
        if (clonedElement) {
          clonedElement.style.transform = 'none';
          clonedElement.style.animation = 'none';
        }
      }
    });

    const imgData = canvas.toDataURL('image/png', quality);
    
    // Create PDF with appropriate dimensions
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = pageWidth - 20; // 10mm margin on each side
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Add header
    pdf.setFontSize(18);
    pdf.setTextColor(59, 130, 246);
    pdf.text('Interview Analysis Dashboard', 20, 15);
    
    // Add generated date
    pdf.setFontSize(10);
    pdf.setTextColor(107, 114, 128);
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - 60, 15);
    
    // Add dashboard image
    let yPosition = 25;
    if (imgHeight > pageHeight - 40) {
      // If image is too tall, scale it down
      const scaledHeight = pageHeight - 40;
      const scaledWidth = (canvas.width * scaledHeight) / canvas.height;
      pdf.addImage(imgData, 'PNG', (pageWidth - scaledWidth) / 2, yPosition, scaledWidth, scaledHeight);
    } else {
      pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, imgHeight);
    }
    
    // Add footer
    pdf.setFontSize(8);
    pdf.setTextColor(156, 163, 175);
    pdf.text('Generated by MockMate - AI Interview Coach', 20, pageHeight - 10);
    
    pdf.save(filename);
    
    return {
      success: true,
      filename,
      message: 'Dashboard PDF generated successfully!'
    };

  } catch (error) {
    console.error('Error generating dashboard PDF:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to generate dashboard PDF'
    };
  }
};
