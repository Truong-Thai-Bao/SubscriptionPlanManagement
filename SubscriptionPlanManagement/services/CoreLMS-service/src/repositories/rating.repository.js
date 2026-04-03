const { Op, fn, col } = require('sequelize');
const Rating = require('../models/mdl_CourseRating');

class ratingRepo {


    //get avg rating for an array of course Ids
    async getAvgRating(courseIds){
        if (!courseIds || courseIds.length === 0) return [];
        return await Rating.findAll({
            attributes: [
                'courseid',
                // SELECT COALESCE(AVG(rating), 0) AS avg_rating
                [fn('COALESCE',fn('AVG',col('rating')),0),'avg_rating']
            ],
            where:{
                courseid : {
                    [Op.in] : courseIds // WHERE courseid IN (1, 2, 3...) 
                }
            },
            group: ['courseid'], //group by course id 
            raw : true // Return plain JSON objects instead of Sequelize instances
        })
    }

}

module.exports = new ratingRepo();