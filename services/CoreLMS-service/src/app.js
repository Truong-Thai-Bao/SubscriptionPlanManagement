const express = require('express');
const courseRoute = require('./routes/courseRoute.js');
const authRoutes = require('./routes/authRoute');

const app = express();

app.use(express.json());
app.use('/api/course',courseRoute);

app.use('/api/auth', authRoutes);
module.exports = app;