const express = require('express');
const courseController = require('../controllers/course.controller');
const router = express.Router();


router.get('/',courseController.getFilterCourses);


module.exports = router;