require('dotenv').config();
const MoodleAPI = require('./services/moddleApi.js');

const moodle = new MoodleAPI();

async function testConnection() {
    console.log("Đang gọi qua Moodle...");
    
    // Fetch all courses by user id = 2 
    const result = await moodle.get(null, 'core_enrol_get_users_courses', { userid: 2 });
    
    if (result.status) {
        console.log("Conn success:", result.data);
    } else {
        console.log("Error:", result.message, result.error);
    }
}

testConnection();