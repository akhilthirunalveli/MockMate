import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Explicitly import the worker script to get a URL that Vite resolves correctly
// The ?url suffix tells Vite to treat this as a static asset URL
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

/**
 * Extracts text from a PDF file.
 * @param {File} file - The PDF file object.
 * @returns {Promise<string>} - The extracted text.
 */
export const extractTextFromPdf = async (file) => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item) => item.str).join(' ');
            fullText += pageText + '\n';
        }

        return fullText;
    } catch (error) {
        console.error("Error extracting text from PDF:", error);
        throw new Error("Failed to extract text from PDF.");
    }
};

/**
 * Extracts text from a DOCX file.
 * @param {File} file - The DOCX file object.
 * @returns {Promise<string>} - The extracted text.
 */
export const extractTextFromDocx = async (file) => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
    } catch (error) {
        console.error("Error extracting text from DOCX:", error);
        throw new Error("Failed to extract text from DOCX.");
    }
};
