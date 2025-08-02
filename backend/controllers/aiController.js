const { GoogleGenerativeAI } = require("@google/generative-ai");
const {
  conceptExplainPrompt,
  questionAnswerPrompt,
} = require("../utils/prompts");

// @desc    Generate interview questions and answers using Gemini
// @route   POST /api/ai/generate-questions
// @access  Private
const generateInterviewQuestions = async (req, res) => {
  try {
    console.log("Generate questions request received:", req.body);
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      console.log("Missing required fields:", { role, experience, topicsToFocus, numberOfQuestions });
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = questionAnswerPrompt(
      role,
      experience,
      topicsToFocus,
      numberOfQuestions
    );

    console.log("About to call Gemini API with prompt:", prompt.substring(0, 100) + "...");
    
    // Create a new instance for each request to avoid any caching issues
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content with error handling
    const result = await model.generateContent(prompt);
    
    if (!result || !result.response) {
      throw new Error("Invalid response from Gemini API");
    }
    
    const response = result.response;
    let rawText = response.text();

    console.log("Gemini API response received, length:", rawText.length);
    console.log("Raw response preview:", rawText.substring(0, 200) + "...");

    // Clean it: Remove ```json and ``` from beginning and end, and handle extra content
    let cleanedText = rawText
      .replace(/^```json\s*/, "") // remove starting ```json
      .replace(/```.*$/, "") // remove ending ``` and anything after it
      .trim(); // remove extra spaces

    // Find the end of the JSON array/object and cut off any extra content
    let jsonEndIndex = -1;
    let bracketCount = 0;
    let inString = false;
    let escapeNext = false;
    
    for (let i = 0; i < cleanedText.length; i++) {
      const char = cleanedText[i];
      
      if (escapeNext) {
        escapeNext = false;
        continue;
      }
      
      if (char === '\\') {
        escapeNext = true;
        continue;
      }
      
      if (char === '"') {
        inString = !inString;
        continue;
      }
      
      if (!inString) {
        if (char === '[' || char === '{') {
          bracketCount++;
        } else if (char === ']' || char === '}') {
          bracketCount--;
          if (bracketCount === 0) {
            jsonEndIndex = i;
            break;
          }
        }
      }
    }
    
    if (jsonEndIndex > -1) {
      cleanedText = cleanedText.substring(0, jsonEndIndex + 1);
    }

    console.log("Cleaned text preview:", cleanedText.substring(0, 200) + "...");
    
    // Now safe to parse
    const data = JSON.parse(cleanedText);

    res.status(200).json(data);
  } catch (error) {
    console.error("Error generating questions:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      message: "Failed to generate questions",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Generate explains a interview question
// @route   POST /api/ai/generate-explanation
// @access  Private
const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = conceptExplainPrompt(question);

    // Create a new instance for each request to avoid any caching issues
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = result.response;
    let rawText = response.text();

    console.log("Explanation API response received, length:", rawText.length);
    console.log("Raw response preview:", rawText.substring(0, 200) + "...");

    // Clean it: Remove ```json and ``` from beginning and end, and handle extra content
    let cleanedText = rawText
      .replace(/^```json\s*/, "") // remove starting ```json
      .replace(/```.*$/, "") // remove ending ``` and anything after it
      .trim(); // remove extra spaces

    // Find the end of the JSON object and cut off any extra content
    let jsonEndIndex = -1;
    let bracketCount = 0;
    let inString = false;
    let escapeNext = false;
    
    for (let i = 0; i < cleanedText.length; i++) {
      const char = cleanedText[i];
      
      if (escapeNext) {
        escapeNext = false;
        continue;
      }
      
      if (char === '\\') {
        escapeNext = true;
        continue;
      }
      
      if (char === '"') {
        inString = !inString;
        continue;
      }
      
      if (!inString) {
        if (char === '[' || char === '{') {
          bracketCount++;
        } else if (char === ']' || char === '}') {
          bracketCount--;
          if (bracketCount === 0) {
            jsonEndIndex = i;
            break;
          }
        }
      }
    }
    
    if (jsonEndIndex > -1) {
      cleanedText = cleanedText.substring(0, jsonEndIndex + 1);
    }

    console.log("Cleaned explanation text preview:", cleanedText.substring(0, 200) + "...");

    // Now safe to parse
    const data = JSON.parse(cleanedText);

    res.status(200).json(data);
  } catch (error) {
    console.error("Error generating explanation:", error);
    res.status(500).json({
      message: "Failed to generate explanation",
      error: error.message,
    });
  }
};

module.exports = { generateInterviewQuestions, generateConceptExplanation };
