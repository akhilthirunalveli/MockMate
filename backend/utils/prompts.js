const questionAnswerPrompt = (
  role,
  experience,
  topicsToFocus,
  numberOfQuestions
) => `
    You are an AI trained to generate technical interview questions and answers.
    
    Task:
    - Role: ${role}
    - Candidate Experience: ${experience} years
    - Focus Topics: ${topicsToFocus}
    - Write ${numberOfQuestions} interview questions.
    - For each question, generate a detailed but beginner-friendly answer.
    - If the answer needs a code example, add a small code block inside.
    - Keep formatting very clean.
    - Return a pure JSON array like:
    [
      {
        "question": "Question here?",
        "answer": "Answer here."
      },
      ...
    ]
    Important: Do NOT add any extra text. Only return valid JSON.
    `;

const conceptExplainPrompt = (question) => `
    You are an AI trained to generate explanations for a given interview question.
    
    Task:
    
    - Explain the following interview question and its concept in depth as if you're teaching a beginner developer.
    - Question: "${question}"
    - After the explanation, provide a short and clear title that summarizes the concept for the article or page header.
    - If the explanation includes a code example, provide a small code block.
    - Keep the formatting very clean and clear.
    - Return the result as a valid JSON object in the following format:
    
    {
        "title": "Short title here?",
        "explanation": "Explanation here."
    }
    
    Important: Do NOT add any extra text outside the JSON format. Only return valid JSON.
    `;

const transcriptAnalysisPrompt = (question, transcript) => `
    You are an AI interview coach trained to analyze and refine interview responses.
    
    Task:
    - Interview Question: "${question}"
    - Candidate's Raw Transcript: "${transcript}"
    
    Analyze the candidate's response and provide:
    1. A refined, professional version of their answer
    2. Specific feedback on what they did well
    3. Areas for improvement with actionable suggestions
    4. An overall score out of 10
    5. Key points they should emphasize in future similar questions
    
    Return the result as a valid JSON object in the following format:
    
    {
        "refinedAnswer": "A polished, professional version of their response that maintains their key points but improves clarity, structure, and professionalism.",
        "strengths": ["List of 2-3 things they did well"],
        "improvements": ["List of 2-3 specific areas to improve with actionable advice"],
        "score": 7,
        "keyTakeaways": ["List of 2-3 key points they should remember for similar questions"],
        "overallFeedback": "A brief summary of their performance and next steps"
    }
    
    Important: 
    - Be constructive and encouraging in your feedback
    - Focus on interview best practices
    - If the transcript is unclear or too short, mention it in the feedback
    - Do NOT add any extra text outside the JSON format. Only return valid JSON.
    `;

const transcriptCleanupPrompt = (rawTranscript) => `
    You are an AI trained to clean and improve speech-to-text transcripts.
    
    Task:
    - Raw Transcript: "${rawTranscript}"
    
    Clean up this transcript by:
    1. Fixing common speech-to-text errors
    2. Adding proper punctuation and capitalization
    3. Removing filler words (um, uh, like, you know) unless they're meaningful
    4. Correcting obvious word mistakes based on context
    5. Improving sentence structure while maintaining the original meaning
    6. Keep the speaker's natural tone and style
    
    Return the result as a valid JSON object:
    
    {
        "cleanedTranscript": "The improved transcript with proper punctuation, grammar, and clarity",
        "improvements": ["List of 2-3 specific improvements made"],
        "confidence": 85
    }
    
    Important: 
    - Maintain the original meaning and intent
    - Don't add information that wasn't spoken
    - Keep technical terms and proper nouns as close to original as possible
    - Do NOT add any extra text outside the JSON format. Only return valid JSON.
    `;

module.exports = { questionAnswerPrompt, conceptExplainPrompt, transcriptAnalysisPrompt, transcriptCleanupPrompt };
