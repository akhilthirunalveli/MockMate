import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const generateCustomInterviewPDF = async (data) => {
  try {
    console.log('Starting custom PDF generation with data:', data);
    
    // Check if required libraries are available
    if (typeof html2canvas === 'undefined') {
      throw new Error('html2canvas library not loaded');
    }
    if (typeof jsPDF === 'undefined') {
      throw new Error('jsPDF library not loaded');
    }
    
    console.log('Libraries check passed');
    
    console.log('Creating content template...');
    
    // Create a temporary container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '794px'; // A4 width at 96 DPI
    container.style.height = 'auto';
    container.style.background = 'white';
    container.style.zIndex = '-1';
    container.style.fontFamily = 'Montserrat, Arial, sans-serif';
    container.style.color = 'black';
    container.style.lineHeight = '1.6';
    container.style.padding = '40px';
    
    // Create the content directly without nested HTML structure
    container.innerHTML = `
      <!-- Header matching your design -->
      <div class="header" style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid black; padding-bottom: 20px;">
        <div class="brand-main" style="font-size: 32px; font-weight: 700; margin-bottom: 8px; letter-spacing: 1px;">MockMate AI</div>
        <div class="subtitle" style="font-size: 18px; font-weight: 600; margin-bottom: 20px; color: #333;">Detailed Report - Interview</div>
        <div class="brand-footer" style="font-size: 12px; font-weight: 700; letter-spacing: 2px; color: #666;">MOCKMATE</div>
      </div>
      
      <!-- Content below header -->
      <div class="content" style="margin-top: 30px;">
        <!-- Score Section -->
        <div class="score-section" style="background: #f9f9f9; padding: 20px; border: 2px solid black; border-radius: 8px; text-align: center; margin-bottom: 30px;">
          <div class="score-value" style="font-size: 48px; font-weight: 700; margin-bottom: 10px;">${data.analysis?.score || 'N/A'}/10</div>
          <div class="score-grade" style="font-size: 24px; font-weight: 600; color: #333;">Grade ${data.analysis?.score >= 9 ? 'A+' : data.analysis?.score >= 8 ? 'A' : data.analysis?.score >= 7 ? 'B+' : data.analysis?.score >= 6 ? 'B' : data.analysis?.score >= 5 ? 'C+' : 'C'}</div>
        </div>
        
        <!-- Enhanced Response -->
        <div class="section" style="margin-bottom: 30px;">
          <div class="section-title" style="font-size: 20px; font-weight: 700; margin-bottom: 15px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Enhanced Professional Response</div>
          <div class="enhanced-response" style="background: #f5f5f5; padding: 20px; border-left: 4px solid black; margin-bottom: 30px; font-size: 16px; line-height: 1.8; white-space: pre-wrap; word-wrap: break-word;">
            ${(data.analysis?.refinedAnswer || 'No enhanced response available.').replace(/\n/g, '<br>')}
          </div>
        </div>
        
        <!-- Quick Stats -->
        <div class="section" style="margin-bottom: 30px;">
          <div class="section-title" style="font-size: 20px; font-weight: 700; margin-bottom: 15px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Session Statistics</div>
          <div class="stats-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px;">
            <div class="stat-card" style="text-align: center; padding: 15px; border: 1px solid #ccc; border-radius: 8px;">
              <div class="stat-value" style="font-size: 24px; font-weight: 700; margin-bottom: 5px;">${data.transcript ? data.transcript.split(' ').length : 0}</div>
              <div class="stat-label" style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Words</div>
            </div>
            <div class="stat-card" style="text-align: center; padding: 15px; border: 1px solid #ccc; border-radius: 8px;">
              <div class="stat-value" style="font-size: 24px; font-weight: 700; margin-bottom: 5px;">${data.transcript ? Math.ceil(data.transcript.split(' ').length / 150) : 0}min</div>
              <div class="stat-label" style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Duration</div>
            </div>
            <div class="stat-card" style="text-align: center; padding: 15px; border: 1px solid #ccc; border-radius: 8px;">
              <div class="stat-value" style="font-size: 24px; font-weight: 700; margin-bottom: 5px;">${data.analysis?.score >= 7 ? 'High' : data.analysis?.score >= 5 ? 'Medium' : 'Low'}</div>
              <div class="stat-label" style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Confidence</div>
            </div>
            <div class="stat-card" style="text-align: center; padding: 15px; border: 1px solid #ccc; border-radius: 8px;">
              <div class="stat-value" style="font-size: 24px; font-weight: 700; margin-bottom: 5px;">${data.analysis?.improvements?.length || 0}</div>
              <div class="stat-label" style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Areas</div>
            </div>
          </div>
        </div>
        
        <!-- Strengths and Improvements -->
        <div class="section" style="margin-bottom: 30px;">
          <div class="two-column" style="display: flex; gap: 30px; margin-bottom: 30px;">
            <div class="column" style="flex: 1;">
              <div class="section-title" style="font-size: 20px; font-weight: 700; margin-bottom: 15px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Strengths Identified</div>
              ${data.analysis?.strengths?.map(strength => `<div class="list-item" style="margin-bottom: 10px; padding-left: 20px; position: relative; word-wrap: break-word;"><span style="position: absolute; left: 0; font-weight: bold;">•</span>${strength}</div>`).join('') || '<div class="list-item" style="margin-bottom: 10px; padding-left: 20px; position: relative;"><span style="position: absolute; left: 0; font-weight: bold;">•</span>No strengths identified</div>'}
            </div>
            <div class="column" style="flex: 1;">
              <div class="section-title" style="font-size: 20px; font-weight: 700; margin-bottom: 15px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Areas for Development</div>
              ${data.analysis?.improvements?.map(improvement => `<div class="list-item" style="margin-bottom: 10px; padding-left: 20px; position: relative; word-wrap: break-word;"><span style="position: absolute; left: 0; font-weight: bold;">•</span>${improvement}</div>`).join('') || '<div class="list-item" style="margin-bottom: 10px; padding-left: 20px; position: relative;"><span style="position: absolute; left: 0; font-weight: bold;">•</span>No improvements identified</div>'}
            </div>
          </div>
        </div>
        
        ${data.analysis?.keyTakeaways?.length ? `
        <div class="section" style="margin-bottom: 30px;">
          <div class="section-title" style="font-size: 20px; font-weight: 700; margin-bottom: 15px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Key Takeaways</div>
          ${data.analysis.keyTakeaways.map((takeaway, index) => `<div class="list-item" style="margin-bottom: 10px; padding-left: 20px; position: relative; word-wrap: break-word;"><span style="position: absolute; left: 0; font-weight: bold;">•</span>${takeaway}</div>`).join('')}
        </div>
        ` : ''}
        
        ${data.analysis?.overallFeedback ? `
        <div class="section" style="margin-bottom: 30px;">
          <div class="section-title" style="font-size: 20px; font-weight: 700; margin-bottom: 15px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Professional Assessment Summary</div>
          <div style="padding: 15px; background: #f9f9f9; border-radius: 8px; font-size: 16px; line-height: 1.8; white-space: pre-wrap; word-wrap: break-word;">
            ${data.analysis.overallFeedback.replace(/\n/g, '<br>')}
          </div>
        </div>
        ` : ''}
        
        <div class="section" style="margin-bottom: 30px;">
          <div class="section-title" style="font-size: 20px; font-weight: 700; margin-bottom: 15px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Session Details</div>
          <div style="font-size: 14px; color: #666;">
            <strong>Question:</strong> ${data.question || 'N/A'}<br>
            <strong>Date:</strong> ${new Date().toLocaleDateString()}<br>
            <strong>Time:</strong> ${new Date().toLocaleTimeString()}<br>
            <strong>User:</strong> ${data.userInfo?.name || 'Anonymous'}
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="footer" style="margin-top: 40px; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #eee; padding-top: 20px;">
        Generated by MockMate AI - Professional Interview Analysis Platform<br>
        © ${new Date().getFullYear()} MockMate. All rights reserved.
      </div>
    `;
    
    document.body.appendChild(container);
    console.log('Temporary container created and added to DOM');
    
    // Wait for fonts and images to load
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Starting canvas conversion...');
    
    // Convert the container directly to canvas
    const canvas = await html2canvas(container, {
      width: 794,
      height: 1123, // A4 height at 96 DPI
      scale: 1.5, // Reduced scale for better performance
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false, // Disable detailed logging
      imageTimeout: 15000,
      removeContainer: false
    });
    
    console.log('Canvas created successfully:', canvas.width, 'x', canvas.height);
    
    // Create PDF
    console.log('Creating PDF...');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // If content is longer than one page, handle multiple pages
    let heightLeft = imgHeight;
    let position = 0;
    
    if (heightLeft >= 297) { // A4 height in mm
      while (heightLeft >= 0) {
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
        position -= 297;
        
        if (heightLeft > 0) {
          pdf.addPage();
        }
      }
    } else {
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
    }
    
    console.log('PDF created successfully');
    
    // Clean up
    document.body.removeChild(container);
    console.log('Temporary container cleaned up');
    
    // Generate unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const fileName = `MockMate_Interview_Report_${timestamp}.pdf`;
    
    // Download PDF
    pdf.save(fileName);
    console.log('PDF downloaded:', fileName);
    
    return { success: true, fileName };
    
  } catch (error) {
    console.error('Custom PDF generation error:', error);
    console.error('Error stack:', error.stack);
    
    // Clean up any remaining containers
    try {
      const containers = document.querySelectorAll('div[style*="position: absolute"][style*="left: -9999px"]');
      containers.forEach(container => {
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
      });
    } catch (cleanupError) {
      console.error('Cleanup error:', cleanupError);
    }
    
    return { success: false, message: error.message || 'Unknown error occurred' };
  }
};
