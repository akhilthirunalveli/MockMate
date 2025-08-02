const axios = require('axios');

async function testAPI() {
    try {
        console.log('Testing API without auth...');
        const response = await axios.post('https://mockmate-backend-r0jk.onrender.com/api/ai/generate-questions', {
            role: "Frontend Developer",
            experience: "2",
            topicsToFocus: "React, JavaScript",
            numberOfQuestions: 5
        });
        console.log('Success:', response.data);
    } catch (error) {
        console.log('Error Status:', error.response?.status);
        console.log('Error Message:', error.response?.data);
        console.log('Full Error:', error.message);
    }
}

testAPI();
