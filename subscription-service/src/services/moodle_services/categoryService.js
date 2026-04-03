const axios = require('axios');
const ResponseDTO = require("../../dtos/responseDTO");
const { getMessage } = require("../../lang/i18n");
const categoryRepository = require("../../repositories/categoryRepository");

class CategoryService {
    async callMoodleCreateCategoryAPI(name, moodleParentId, description) {
        try {
            const response = await axios.get(process.env.MOODLE_BASE_URL, {
                params: {
                    wstoken: process.env.MOODLE_ADMIN_TOKEN,
                    wsfunction: "core_course_create_categories",
                    moodlewsrestformat: "json",
                    'categories[0][name]': name,
                    'categories[0][description]': description,
                    'categories[0][parent]': moodleParentId
                }
            });

            if (response.data.exception || !Array.isArray(response.data)) {
                return { success: false, message: response.data.message };
            }
            return { success: true, data: response.data[0] };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    async createCategory(name, parent_id, description, lang) {
        let createdMoodleId = null;
        try {
            const localParentId = parent_id || 0;
            let moodleParentId = 0;

            // 1. Tìm moodleParentId nếu localParentId > 0
            if (localParentId !== 0) {
                const parentCategory = await categoryRepository.getCategoryById(localParentId);
                if (!parentCategory) {
                    return new ResponseDTO(
                        getMessage(lang, "system.error.not_found"),
                        404,
                        false,
                        null,
                        { Parent: [getMessage(lang, "function.category.parent_not_found")] }
                    );
                }
                moodleParentId = parentCategory.moodle_category_id;
            }

            // 2. Tạo bên Moodle
            const moodleRes = await this.callMoodleCreateCategoryAPI(name, moodleParentId, description);
            if (!moodleRes.success) {
                return new ResponseDTO(moodleRes.data ? moodleRes.data.message : moodleRes.message, 400, false);
            }

            createdMoodleId = moodleRes.data.id;
            // 3. Lưu vào DB project
            try {
                const newCategory = await categoryRepository.createCategory({
                    name: name,
                    parent_id: localParentId,
                    description: description,
                    moodle_category_id: createdMoodleId,
                    status: 1
                });
                return new ResponseDTO(getMessage(lang, "function.category.create_success"), 201, true, newCategory);

            } catch (dbError) {
                console.error("Local DB Error, rolling back Moodle...");
                await this.callMoodleDeleteCategoryAPI(createdMoodleId);
                throw dbError;
            }

        } catch (error) {
            return new ResponseDTO(getMessage(lang, "system.error.system_error"), 500, false);
        }
    }

    async callMoodleDeleteCategoryAPI(moodleId) {
        try {
            const response = await axios.get(process.env.MOODLE_BASE_URL, {
                params: {
                    wstoken: process.env.MOODLE_ADMIN_TOKEN,
                    wsfunction: "core_course_delete_categories",
                    moodlewsrestformat: "json",
                    'categories[0][id]': moodleId,
                    'categories[0][recursive]': 1
                }
            });
            if (response.data && response.data.exception) {
                return { success: false, message: response.data.message };
            }

            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    async deleteCategory(id, lang) {
        try {
            const category = await categoryRepository.getCategoryById(id);
            if (!category) {
                return new ResponseDTO(
                    getMessage(lang, "system.error.not_found"),
                    404,
                    false,
                    null,
                    { Category: [getMessage(lang, "function.category.not_exist")] }
                )
            }

            //CHECK CHILD
            const childrenCount = await categoryRepository.countChildren(id);
            if (childrenCount > 0) {
                return new ResponseDTO(
                    getMessage(lang, "function.category.has_children"),
                    400,
                    false
                );
            }

            const moodleRes = await this.callMoodleDeleteCategoryAPI(category.moodle_category_id);
            if (!moodleRes.success) {
                return new ResponseDTO(moodleRes.data ? moodleRes.data.message : moodleRes.message, 400, false);
            }

            const result = await categoryRepository.deleteCategory(category);
            return new ResponseDTO(getMessage(lang, "function.category.delete_success"), 200, true, result);
        } catch (error) {
            return new ResponseDTO(getMessage(lang, "system.error.system_error"), 500, false);
        }
    }

    async callMoodleGetAllCategoryAPI() {
        try {
            const response = await axios.get(process.env.MOODLE_BASE_URL, {
                params: {
                    wstoken: process.env.MOODLE_ADMIN_TOKEN,
                    wsfunction: "core_course_get_categories",
                    moodlewsrestformat: "json"
                }
            });
            if (response.data && response.data.exception) {
                return { success: false, message: response.data.message };
            }

            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    async getAllCategory(lang) {
        try {
            const categories = await categoryRepository.getAllCategories();

            // 2. Chuyển sang JSON thuần
            const list = categories.map(cat => cat.toJSON());

            // 3. Logic dựng Tree (Cây)
            const tree = [];
            const lookup = {};

            list.forEach(item => {
                lookup[item.id] = { ...item, children: [] };
            });

            list.forEach(item => {
                const parentId = item.parent_id;
                if (parentId === 0 || parentId === null) {
                    tree.push(lookup[item.id]);
                } else if (lookup[parentId]) {
                    lookup[parentId].children.push(lookup[item.id]);
                } else {
                    // Phòng trường hợp cha bị xóa nhầm ở đâu đó
                    tree.push(lookup[item.id]);
                }
            });

            return new ResponseDTO(getMessage(lang, "function.category.get_success"), 200, true, tree);
        } catch (error) {
            console.log(error);
            return new ResponseDTO(getMessage(lang, "system.error.system_error"), 500, false);
        }
    }
}

module.exports = new CategoryService();