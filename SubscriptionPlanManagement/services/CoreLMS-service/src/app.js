const express = require('express');
const courseRoute = require('./routes/course.route.js');


const app = express();


app.use('/api/courses',courseRoute);

module.exports = app;