const express = require('express');
const courseRoute = require('./routes/courseRoute.js');


const app = express();


app.use('/api/course',courseRoute);

module.exports = app;