const { Op } = require('sequelize');
const TagInstance = require('../models/mdl_TagInstance.js');
const Tag = require('../models/mdl_Tag.js');

class TagRepository {

    //Fetch all tags associated with an array of course ids
    async getTagsByCourseIds(courseIds){
        if (!courseIds || courseIds.length === 0) return [];
        const res =  await TagInstance.findAll({
            attributes:['itemid'], //select course id
            where:{
                itemtype : 'course',
                itemid: {
                    [Op.in] : courseIds
                }
            },
            include:[{
                model : Tag,
                as : 'tagDetails',
                attributes:['name']
            }],
            raw : true,
            nest : true //format include 
        })

        //Map result to match the expected course
        return res.map(row => ({
            courseid: row.itemid,
            tag_name : row.tagDetails?.name || null
        }))
    }


}
module.exports = new TagRepository();