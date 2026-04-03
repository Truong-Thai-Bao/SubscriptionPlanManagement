const Category = require("../models/Category");

class CategoryRepository {
    async getCategoryById(id) {
        return await Category.findByPk(id);
    }

    async getAllCategories() {
        return await Category.findAll({
            order: [['parent_id', 'ASC'], ['id', 'ASC']]
        });
    }

    async getCategoryByCondition(condition) {
        return await Category.findAll({
            where: condition,
        });
    }

    async getCategoryByMoodleCategoryId(condition) {
        return await Category.findOne({
            where: condition
        })
    }

    async saveCategory(instance) {
        return await instance.save();
    }

    async createCategory(data) {
        return await Category.create(data);
    }

    async updateCategory(instance, data) {
        await instance.set(data);
        return await instance.save();
    }

    async countChildren(parentId) {
        return await Category.count({
            where: { parent_id: parentId }
        });
    }

    async deleteCategory(instance) {
        return await instance.destroy();
    }
}

module.exports = new CategoryRepository();