const BaseRepository = require("./BaseRepository");
const { v4: uuidv4 } = require("uuid");
const LearningPath = require("../models/mdl_LearningPath");
const sequelize = require("../config/db");
const LearningPathCourses = require("../models/mdl_learningPathCourse");
const UserLearningPath = require("../models/mdl_userLearningPath");
const UserLearningPathCourseProgress = require("../models/mdl_userLearningPathCourseProgress");
class LearningPathRepository extends BaseRepository {
    constructor() {
        super(LearningPath);
    }
    /**
     * Get list learning path by learner id with pagination
     * @param {*} learnerId 
     * @param {number} page 
     * @param {number} limit 
     * @returns 
     */
    async getListLearningPathByUserId(learnerId, page = 1, limit = 10) {
        const offset = (page - 1) * limit;

        const { count, rows } = await UserLearningPath.findAndCountAll({
            where: { learnerId },
            include: [
                {
                    model: LearningPath,
                    as: "learningPath",
                    attributes: ["id", "name", "description", "publishStatus"],
                    required: true,
                },
            ],
            order: [["createdAt", "DESC"]],
            limit,
            offset,
            subQuery: false,
        });

        return {
            total: count,
            page,
            limit,
            data: rows,
        };
    }
    /**
     * Get learning path detail by learner id, 
     * return the latest assigned learning path of the learner
     * @param {*} learnerId 
     * @returns 
     */
    async getLearningPathDetailByUserId(learnerId) {
        const item = await UserLearningPath.findOne({
            where: { learnerId },
            order: [["createdAt", "DESC"]],
            attributes: [
                "id",
                "learnerId",
                "pathId",
                "isComplete",
                "completePercentage",
                "assignBy",
                "createdAt",
                "updatedAt",
            ],
            include: [
                {
                    model: LearningPath,
                    as: "learningPath",
                    attributes: [
                        "id",
                        "name",
                        "description",
                        "publishStatus",
                        "isActive",
                    ],
                    include: [
                        {
                            model: LearningPathCourses,
                            as: "courses",
                            attributes: [
                                "id",
                                "courseId",
                                "moodleCourseId",
                                "name",
                                "imageUrl",
                                "shortName",
                                "orderIndex",
                                "isActive",
                            ],
                        },
                        {
                            model: UserLearningPathCourseProgress,
                            as: "courseProgresses",
                            attributes: ["courseId", "moodleCourseId", "status"],
                        },
                    ],
                },
            ],
        });
        return this.mapLearningPathDetail(item);
    }
    /**
     * Assign a learning path to a learner, but if the learner already has an active learning path, 
     * they cannot be assigned to another learning path until 
     * they complete the current learning path.
     * @param {*} param0 
     * @param {*} assignById 
     * @returns 
     */
    async assignLearningPath({ learnerId, pathId }, assignById) {
        const transaction = await sequelize.transaction();
        try {
            const existing = await UserLearningPath.findOne({
                where: { learnerId, pathId },
                order: [["createdAt", "DESC"]],
                transaction,
            });

            if (existing && !existing.isComplete) {
                throw new Error("User already has an active learning path.");
            }

            const pathItem = await LearningPath.findOne({
                where: { id: pathId },
                include: [
                    {
                        model: LearningPathCourses,
                        as: "courses",
                        attributes: ["id", "moodleCourseId", "courseId"],
                    },
                ],
                transaction,
            });

            if (!pathItem) {
                throw new Error("Not found learning path.");
            }

            const result = await UserLearningPath.create(
                {
                    id: uuidv4(),
                    learnerId,
                    pathId,
                    isComplete: false,
                    completePercentage: 0,
                    assignBy: assignById,
                },
                { transaction }
            );
            const userLPCoursesProgress = pathItem?.courses?.map((item) => ({
                id: uuidv4(),
                learnerId,
                pathId,
                courseId: item?.courseId,
                moodleCourseId: item?.moodleCourseId,
                status: false,
            }));
            const progressResult = await UserLearningPathCourseProgress.bulkCreate(
                userLPCoursesProgress,
                { transaction }
            );

            await transaction.commit();

            return {
                status: true,
                success: true,
                data: result,
                message: "Assign successfully",
            };
        } catch (err) {
            await transaction.rollback();
            return {
                status: false,
                success: false,
                error: err.message,
            };
        }
    }
    /**
     * Learner can unassign learning path if they want, but only when the learning 
     * path is not completed yet. If the learning path is completed, 
     * they cannot unassign it anymore.
     * @param {string} id 
     * @returns 
     */
    async unassignLearningPath(id) {
        const transaction = await sequelize.transaction();
        try {
            const item = await UserLearningPath.findByPk(id, {
                transaction,
            });

            if (!item) {
                throw new Error("Not found record");
            }

            const result = await item.destroy({ transaction });
            await transaction.commit();

            return {
                status: true,
                success: true,
                data: result,
                message: "Unassign successfully",
            };
        } catch (err) {
            await transaction.rollback();
            return {
                status: false,
                success: false,
                error: err.message,
            };
        }

    }

    /**
     * Map learning path detail from database result
     * @param {*} item 
     * @returns 
     */
    mapLearningPathDetail(item) {
        if (!item) return null;
        return {
            id: item.id,
            learnerId: item.learnerId,
            pathId: item.pathId,
            isComplete: item.isComplete,
            completePercentage: item.completePercentage,
            assignBy: item.assignBy,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            learningPath: item.learningPath,
        };
    }
}

module.exports = new LearningPathRepository();