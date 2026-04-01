const courseService = require("../services/courseService");

class courseController {

    getFilterCourses = async(req,res,next) => {
        const filters = req.query;
        console.log(filters);
        const tenantId = req.headers['x-tenant-id'];

        const getService = await courseService.getFilteredCourses(tenantId, filters);

        if(!getService){
            return res.status(404).json({
                success:false,
                message: 'Cannot found this course'
            })
        }

        return res.status(200).json({
            success:true,
            data: getService,
        })
    }
}

module.exports = new courseController;