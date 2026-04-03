/**
 * Feature Management Service.
 * * This service handles high-level business logic for system features.
 * Key capabilities include dynamic JSON configuration management (File System I/O),
 * relational integrity checks before deletion, and automated audit logging.
 * * @module services/FeatureService
 * @requires repositories/FeatureRepository
 * @requires repositories/PermissionRepository
 * @requires repositories/SubscriptionPlanRepository
 * @requires fs
 * @requires path
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-24
 */

const featureRepo = require("../repositories/featureRepository");
const permissionRepo = require("../repositories/permissionRepository");
const subscriptionPlanRepo = require("../repositories/subscriptionPlanRepository");
const subcriptionLogRepository = require("../repositories/subscriptionLogRepository");
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const ResponseDTO = require("../dtos/responseDTO");
const { getMessage } = require("../lang/i18n");

class FeatureService {
    /**
     * Retrieves all features currently enabled (status = 1).
     * @async
     * @param {string} lang - Language code for response messages.
     * @returns {Promise<ResponseDTO>}
     */
    async getAllActiveFeature(lang) {
        try {
            const all = (await featureRepo.getAllFeature()).filter((f) => f.status === 1);
            return new ResponseDTO(getMessage(lang, "function.feature.get_active_feature_success"), 200, true, all);
        } catch (error) {
            return new ResponseDTO(getMessage(lang, "system.error.system_error"), 500, false);
        }
    }

    /**
     * Fetches all features and hydrates JSON configurations from the file system.
     * @async
     * @param {string} lang - Language code.
     * @returns {Promise<ResponseDTO>}
     */
    async getAllFeatures(lang) {
        try {
            const all = (await featureRepo.getAllFeature());
            const processedFeatures = await Promise.all(all.map(async (feature) => {
                const item = feature.get ? feature.get({ plain: true }) : { ...feature };


                if (item.value_type === 'json') {
                    item.feature_value = await this.readJsonFromFile(item.feature_value, item.name);
                }

                return item;
            }));
            return new ResponseDTO(getMessage(lang, "function.feature.get_feature_success"), 200, true, processedFeatures);
        } catch (error) {
            return new ResponseDTO(getMessage(lang, "system.error.system_error"), 500, false);
        }
    }

    /**
     * Deletes a feature after verifying no active dependencies (Permissions/Plans) exist.
     * @async
     * @param {number|string} id - Feature ID.
     * @param {string} lang - Language code.
     * @returns {Promise<ResponseDTO>}
     */
    async deleteFeature(id, lang) {
        try {
            const feature = await featureRepo.getFeaturedById(id);
            this.checkExist(feature, lang);

            //CHECK SUBSRIPTION PLAN WITH FEATURE_ID EXIST?
            const subscription_plan = await subscriptionPlanRepo.getSubscriptionPlanByCondition({
                feature_id: id,
            })
            if (subscription_plan && subscription_plan.length > 0)
                return new ResponseDTO(getMessage(lang, "function.feature.delete_failed_for_subcription_plan"), 400, false);

            //CHECK PERMISSION WITH FEATURE_ID EXIST?
            const permission = await permissionRepo.getPermissionByCondition({
                feature_id: id,
            })
            if (permission && permission.length > 0)
                return new ResponseDTO(getMessage(lang, "function.feature.delete_failed_for_permission"), 400, false);

            //DELETE FEATURE
            const deletedFeature = await featureRepo.deleteFeature(feature);
            return new ResponseDTO(
                getMessage(lang, "function.feature.delete_feature_success"),
                200,
                true,
                deletedFeature,
            );

        } catch (error) {
            console.log = error;
            return new ResponseDTO(getMessage(lang, "system.error.system_error"), 500, false);
        }
    }

    /**
     * Creates a new feature and initializes its physical JSON configuration file.
     * @async
     * @param {Object} data - Feature creation parameters.
     * @param {string} lang - Language code.
     * @returns {Promise<ResponseDTO>}
     */
    async createFeature(data, lang) {
        try {
            const existingFeature = await featureRepo.getFeatureByCondition({
                name: data.name,
            });

            if (existingFeature && existingFeature.length > 0) {
                return new ResponseDTO(
                    getMessage(lang, "system.validation.validation"),
                    400,
                    false,
                    null,
                    { Name: [getMessage(lang, "function.feature.name_exists")] },
                );
            }

            let feature_value;
            if (data.value_type === "json") {
                feature_value = await this.createJson(data);
            } else {
                feature_value = data.feature_value;
            }
            //format feature key by feature name
            const splitted = data.name.toUpperCase().split(" ").join('_');

            const newFeature = {
                name: data.name,
                description: data.description,
                feature_key: splitted,
                value_type: data.value_type,
                feature_value: feature_value
            };
            const returnData = await featureRepo.createFeature(newFeature);

            this.createLog(returnData, "Create new Feature: ");
            return new ResponseDTO(getMessage(lang, "function.feature.create_feature_success"), 201, true, returnData)
        } catch (error) {
            return new ResponseDTO(getMessage(lang, "system.error.system_error"), 500, false);
        }
    }

    /**
     * Updates feature metadata and synchronizes JSON file content or paths.
     * Handles transitions between JSON and non-JSON value types.
     * @async
     * @param {number|string} id - Feature identifier.
     * @param {Object} updateData - Modified feature attributes.
     * @param {string} lang - Language code.
     * @returns {Promise<ResponseDTO>}
     */
    async updateFeature(id, updateData, lang) {
        try {
            if (updateData.status !== 0 || updateData.status !== 1) {
                return new ResponseDTO(getMessage(lang, "system.validation.validation"), 400, false, null, { status: [getMessage(lang, "function.role.status_wrong")] });
            }
            const feature = await featureRepo.getFeaturedById(id);
            this.checkExist(feature, lang);
            if (updateData.name && updateData.name !== feature.name) {
                const duplicate = await featureRepo.getFeatureByCondition({
                    name: updateData.name,
                });
                if (duplicate.length > 0)
                    return new ResponseDTO(
                        getMessage(lang, "system.validation.validation"),
                        400,
                        false,
                        null,
                        { Name: [getMessage(lang, "function.role.name_exists")] },
                    );
            }

            //IF OLD AND NEW DATA ARE JSON
            if (updateData.value_type === 'json' && feature.value_type === 'json') {
                //IF OLD AND NEW HAVE SAME FEATURE NAME
                if (feature.name === updateData.name) {
                    await this.updateJsonFile(feature.name, updateData.feature_value);
                    updateData.feature_value = feature.feature_value;
                }
                else {
                    const oldPath = path.join(__dirname, '..', 'feature-configs', `${feature.name}.json`);
                    const newPath = path.join(__dirname, '..', 'feature-configs', `${updateData.name}.json`);
                    if (fs.existsSync(oldPath)) {
                        fs.renameSync(oldPath, newPath);
                    }
                    await this.updateJsonFile(updateData.name, updateData.feature_value);
                    updateData.feature_value = `feature-configs/${updateData.name}`;
                }
            }

            //IF NEW IS JSON AND OLD IS OTHER
            else if (updateData.value_type === 'json' && updateData.value_type !== feature.value_type) {
                updateData.feature_value = await this.createJson(updateData);
            }

            //IF OLD IS JSON AND NEW IS OTHER
            else if (feature.value_type === 'json' && updateData.value_type !== feature.value_type) {
                const pathOld = path.join(__dirname, '..', 'feature-configs', `${feature.name}.json`);
                if (fs.existsSync(pathOld)) {
                    fs.unlinkSync(pathOld);
                }
            }

            const result = await featureRepo.updateFeature(feature, updateData);
            await this.createLog(result, "Update a Feature: ");
            return new ResponseDTO(getMessage(lang, "function.feature.update_feature_success"), 200, true, result);
        } catch (error) {
            return new ResponseDTO(getMessage(lang, "system.error.system_error"), 500, false);
        }
    }

    // --- Private Helper Methods ---

    /**
     * Validates if a feature instance exists.
     * @private
     */
    async checkExist(feature, lang) {
        if (!feature) {
            return new ResponseDTO(getMessage(lang, "function.feature.feature_not_exists"), 400, false);
        }
    }

    /**
     * Generates an audit log entry for feature-related actions.
     * @private
     */
    async createLog(feature, message) {
        try {
            const subLog = {
                log_entry: `${message} ${feature.name}`,
                entity: "Feature",
            };
            await subcriptionLogRepository.createLog(subLog);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Writes JSON data to the 'feature-configs' directory.
     * @private
     */
    async createJson(feature) {
        try {
            let featureValue = feature.feature_value;
            const folderPath = path.join(process.cwd(), "src", "feature-configs");
            //CREATE FOLDER FEATURE_CONFIGS IF DONT HAVE
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }

            const fileName = `${feature.name}.json`;
            const filePath = path.join(folderPath, fileName);
            // validate JSON trước khi ghi (optional nhưng nên có)
            const jsonData =
                typeof feature.feature_value === "string"
                    ? JSON.parse(feature.feature_value)
                    : feature.feature_value;

            fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

            // lưu path vào DB
            featureValue = `feature-configs/${fileName}`;
            return featureValue;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Reads and parses JSON data from the file system.
     * @private
     */
    async readJsonFromFile(relativePath, featureName) {
        try {
            if (!relativePath) return null;

            const absolutePath = path.join(__dirname, '..', 'feature-configs', `${featureName}.json`);

            if (!fs.existsSync(absolutePath)) {
                return relativePath;
            }

            const stats = fs.statSync(absolutePath);

            if (stats.isFile()) {
                const content = fs.readFileSync(absolutePath, 'utf8');
                return JSON.parse(content);
            }

            if (stats.isDirectory()) {
                const files = fs.readdirSync(absolutePath);
                const combinedData = {};

                files.forEach(file => {
                    if (path.extname(file) === '.json') {
                        const filePath = path.join(absolutePath, file);
                        const content = fs.readFileSync(filePath, 'utf8');
                        // Lấy tên file làm Key, nội dung làm Value
                        combinedData[path.basename(file, '.json')] = JSON.parse(content);
                    }
                });
                return combinedData;
            }

            return null;
        } catch (error) {
            return relativePath;
        }
    }

    /**
     * Overwrites an existing JSON configuration file.
     * @private
     */
    async updateJsonFile(featureName, newData) {
        try {
            const filePath = path.join(__dirname, '..', 'feature-configs', `${featureName}.json`);

            // Ghi đè hoàn toàn nội dung mới vào file
            // Nếu file chưa có thì nó tự tạo, nếu có rồi thì nó xóa hết nội dung cũ để ghi cái mới
            fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), 'utf8');
            return true;
        } catch (error) {
            return new ResponseDTO(getMessage(lang, "function.feature.update_json_fail"), 400, false);
        }
    }
}

module.exports = new FeatureService();