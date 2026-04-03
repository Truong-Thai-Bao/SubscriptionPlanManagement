/**
 * @class CourseRepository
 * @description This class for managing db operations related to LmsCourse table
 */
const BaseRepository = require('./BaseRepository');

class CourseRepository extends BaseRepository {

    constructor(){
        super();
    }

    //send query to db
    async getFilterCourse(condition){
        const courses = await this.findAll({
            where : condition,
            order : [['created_at','DESC']], // order by created time
            include : [{
                model : LmsCategory,
                as :'category'
            }]
        })
        return courses;
    }

}

module.exports = new CourseRepository();