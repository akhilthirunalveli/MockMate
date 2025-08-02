const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: "./backend/.env" });

async function testGeminiAPI() {
  try {
    console.log("Testing Gemini API with new library...");
    console.log("API Key exists:", !!process.env.GEMINI_API_KEY);
    console.log("API Key length:", process.env.GEMINI_API_KEY?.length);
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Generate a simple JSON response with one interview question: {\"questions\": [{\"question\": \"What is JavaScript?\", \"answer\": \"JavaScript is a programming language.\"}]}";
    
    console.log("Sending request to Gemini...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("Response received:");
    console.log(text);
    
    console.log("✅ API test successful!");
  } catch (error) {
    console.error("❌ API test failed:");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
  }
}

testGeminiAPI();
