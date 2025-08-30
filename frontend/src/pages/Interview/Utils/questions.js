export const interviewQuestions = [
  "Tell me about yourself and why you're interested in this position.",
  "What are your greatest strengths and weaknesses?",
  "Describe a challenging situation you faced and how you handled it.",
  "Where do you see yourself in 5 years?",
  "Why do you want to work for our company?",
  "Tell me about a time you worked in a team.",
  "How do you handle stress and pressure?",
  "What motivates you in your work?",
  "Describe your ideal work environment.",
  "What questions do you have for me?",
  "Tell me about a time you failed and how you handled it.",
  "How do you stay updated with the latest technologies?",
  "Describe a project you're particularly proud of.",
  "How do you prioritize your tasks when you have multiple deadlines?",
  "Tell me about a time you had to learn something new quickly.",
  "How do you handle constructive criticism?",
  "Describe a time when you had to work with a difficult team member.",
  "What's your approach to problem-solving?",
  "How do you ensure the quality of your work?",
  "Tell me about a time you took initiative on a project."
];

export const generateRandomQuestion = () => {
  return interviewQuestions[Math.floor(Math.random() * interviewQuestions.length)];
};
