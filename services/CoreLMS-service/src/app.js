const express = require('express');
const courseRoute = require('./routes/courseRoute.js');
const searchRoute = require('./routes/searchRoute');

const app = express();


app.use('/api/course',courseRoute);
app.use('/api/search', searchRoute);
module.exports = app;