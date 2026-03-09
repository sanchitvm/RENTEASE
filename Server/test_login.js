const axios = require('axios');

async function testLogin() {
    try {
        console.log('Sending login request to http://localhost:5000/login...');
        const response = await axios.post('http://localhost:5000/login', {
            email: 'test@example.com',
            password: 'password123',
            userType: 'hunter'
        });
        console.log('Response:', response.data);
    } catch (error) {
        console.log('Error Status:', error.response?.status);
        console.log('Error Data:', error.response?.data);
        console.log('Error Message:', error.message);
    }
}

testLogin();
