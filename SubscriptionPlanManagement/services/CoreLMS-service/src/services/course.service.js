const { Op } = require("sequelize");
const moodleApi = require('./moddleApi.js');
const moodle = new moodleApi();
const CourseDTO = require('../dtos/courseDTO.js');
const ratingRepository = require("../repositories/rating.repository.js");
const tagRepository = require("../repositories/tag.repository.js");

class courseService {
    async getFilteredCourses(queryParams){

        let courses = [];
        let raw = [];

        //get all courses by id
        if(queryParams.categoryId){
            courses = await moodle.get(
                null,
                'core_course_get_courses_by_field',
                { 
                    field: 'category', 
                    value: queryParams.categoryId 
                }
            );
            raw = courses.data?.courses;
        }else{
            //get all courses 
            courses = await moodle.get(
                null,
                'core_course_get_courses'
            );
            raw = courses.data;
        }
        
        //if not have any courses
        if(!courses.status || !raw){
            console.log(courses.message || "Cannot find courses data");
            return [];
        }

        //get all course ids 
        const courseIds = raw.map(c => c.id);
        //call repo 
        const [ratingResults,tagResults] =  await Promise.all([
            ratingRepository.getAvgRating(courseIds),
            tagRepository.getTagsByCourseIds(courseIds)
        ])

        //Map data into DTO
        let processedCourses = raw.map(course => {
            //get rating and tag data
            const ratingData = ratingResults.find(r => Number(r.courseid) === course.id);
            const tagData = tagResults.filter(t => Number(t.courseid) === course.id).map(t => t.tag_name);
            //put data into course
            course.avgRating = ratingData ? parseFloat(ratingData.avg_rating) : 0;
            course.tags = tagData;

            return new CourseDTO(course);
        })

        if (queryParams.minRating) {
            processedCourses = processedCourses.filter(c => c.rating >= parseFloat(queryParams.minRating));
        }
        if (queryParams.tag) {
            const searchTag = queryParams.tag.toLowerCase();
            processedCourses = processedCourses.filter(c => c.tags.some(t => t.toLowerCase() === searchTag));
        }

        return processedCourses;
    }   
}

module.exports = new courseService;