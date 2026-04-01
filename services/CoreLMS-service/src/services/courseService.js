const { Op } = require("sequelize");
const Course = require('../models/lmscourse.js')
const Category = require('../models/lmscategory.js');
const courseRepository = require("../repositories/courseRepository.js");


class courseService {
    async getFilteredCourses(tenantId,queryParams){

        //initial original condition
        const condition = {
            tenant_id : tenantId,
            status : 'active'
        }
        console.log(queryParams.categoryId)

        //Query based on category id
        if(queryParams.categoryId){
            condition.category_id = {
                [Op.eq] : parseInt(queryParams.categoryId)
            }
        }
        console.log(queryParams.minRating);
        console.log(queryParams.tags);

        //Filter based on rating
        if(queryParams.minRating){
            condition.average_rating = { 
                [Op.gte] : parseFloat(queryParams.minRating) 
            }
        }

        //Filter based on tag
        if(queryParams.tags){
            const tagArray = queryParams.tags.split(',');

            condition.tags = {
                [Op.or] : tagArray.map(tag => ({
                    [Op.like] : `%${tag.trim()}%` 
                }))
            }
        }

        

        return await courseRepository.getFilterCourse(condition);
    }   
}

module.exports = new courseService;