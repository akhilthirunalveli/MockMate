const { GoogleGenerativeAI } = require("@google/generative-ai");
const CoachMateChat = require("../models/CoachMateChat");

// System Prompt for CoachMate
const COACHMATE_SYSTEM_PROMPT = `
You are Coachmate, the friendly AI Career companion for MockMate.
Your goal is to be a supportive placement friend while subtly encouraging users to use MockMate's powerful tools.

Crucial Routing Map (ONLY use these routes):
- Dashboard: [/dashboard](/dashboard)
- HR Interview Practice: [/interview/hr/record](/interview/hr/record)
- Session-based Interview: [/interview/session-interview](/interview/session-interview)
- Live Interview: [/interview/live](/interview/live)
- Resume View: [/resume-view](/resume-view)
- ATS Checker: [/resume/ats-check](/resume/ats-check)
- Documentation: [/docs](/docs)

Key Traits:
- Tone: Empathetic, optimistic, and conversational.
- Direct & Helpful: Answer career questions directly but always suggest a MockMate tool as a next step.
- Self-Promotion:
    - If a user is worried about an interview, suggest "Practice right now in our [HR Interview Room](/interview/hr/record)".
    - If a user mentions their resume, suggest "Run it through our [ATS Checker](/resume/ats-check)".
    - Always use the clean markdown links from the Routing Map above.

Style:
- Short, punching sentences.
- Use emojis naturally.
- When asked for tips, provide 2-3 and then a "Ready to practice?" call to action.

Context:
- MockMate Tools: Interview Prep, Resume Workspace, specialized practice sessions.
`;

// @desc    Get chat history for CoachMate
// @route   GET /api/coach/history
// @access  Private
const getChatHistory = async (req, res) => {
    try {
        let chat = await CoachMateChat.findOne({ userId: req.user._id });
        if (!chat) {
            // Create initial chat with system prompt if needed or just return empty
            return res.status(200).json({ messages: [] });
        }
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch chat history", error: error.message });
    }
};

// @desc    Send a message to CoachMate
// @route   POST /api/coach/chat
// @access  Private
const chatWithCoach = async (req, res) => {
    try {
        console.log("[CoachMate] Chat request initiated");
        const { message } = req.body;
        if (!message) return res.status(400).json({ message: "Message is required" });

        // 1. Get/Create Chat History
        let chat = await CoachMateChat.findOne({ userId: req.user._id });
        if (!chat) {
            console.log("[CoachMate] Creating new chat session for user");
            chat = new CoachMateChat({ userId: req.user._id, messages: [] });
        }

        // 2. Prepare Context (following working aiController pattern)
        if (!process.env.GEMINI_API_KEY) {
            console.error("[CoachMate] GEMINI_API_KEY missing");
            return res.status(500).json({ message: "AI API Key missing" });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const userName = req.user?.name || "Candidate";
        const resumeLink = req.user?.resumeLink || null;

        // Construct a single, powerful prompt
        let finalPrompt = `
${COACHMATE_SYSTEM_PROMPT}

USER PERSONAL DATA:
- Candidate Name: ${userName}
- Candidate Resume Link: ${resumeLink || "Not uploaded"}

SPECIFIC INSTRUCTION FOR RESUME:
If the user asks for their resume, resume link, or where their file is, YOU MUST provide this link: ${resumeLink || "None available"}
Format the response like: "Here is your latest resume: [View Resume](${resumeLink || '#'})"

CONVERSATION CONTEXT (Last 10 messages):
`;

        const recentMessages = chat.messages.slice(-10);
        recentMessages.forEach(msg => {
            finalPrompt += `${msg.role === 'user' ? 'User' : 'CoachMate'}: ${msg.content}\n`;
        });

        finalPrompt += `User: ${message}\nCoachMate: `;

        console.log(`[CoachMate] Prompt built (Length: ${finalPrompt.length})`);

        // 3. Generate Content with Verified Pattern
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const generateWithRetry = async (model, prompt, retries = 3, delay = 2000) => {
            try {
                console.log(`[CoachMate] Gemini Call... (Attempts left: ${retries})`);
                const result = await model.generateContent(prompt);
                return result;
            } catch (error) {
                if (retries > 0 && (error.status === 429 || error.message?.includes('429'))) {
                    console.warn(`[CoachMate] Rate limit. Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return generateWithRetry(model, prompt, retries - 1, delay * 2);
                }
                throw error;
            }
        };

        const result = await generateWithRetry(model, finalPrompt);
        const responseText = result.response.text();

        console.log(`[CoachMate] AI Response success (${responseText.length} chars)`);

        // 4. Save and Update
        chat.messages.push({ role: "user", content: message });
        chat.messages.push({ role: "model", content: responseText });
        await chat.save();

        res.status(200).json({ reply: responseText, history: chat.messages });

    } catch (error) {
        console.error("[CoachMate] Fatal Error:", error);
        res.status(500).json({
            message: "CoachMate encountered an error. Please try again.",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

const resetChatHistory = async (req, res) => {
    try {
        await CoachMateChat.findOneAndDelete({ userId: req.user._id });
        res.status(200).json({ message: "Chat history cleared successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to clear chat history", error: error.message });
    }
};

module.exports = { getChatHistory, chatWithCoach, resetChatHistory };
