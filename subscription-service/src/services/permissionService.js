/**
 * Permission Management Service.
 * * This service provides the business logic for managing granular access controls.
 * It coordinates between Permission, Feature, and Subscription Log repositories
 * to ensure data integrity and provide detailed audit trails.
 * * Key functionalities:
 * - Dynamic data hydration (mapping Feature names to Permissions).
 * - Cross-entity validation (ensuring Features exist before assigning Permissions).
 * - Automated system logging for administrative actions.
 * * @module services/PermissionService
 * @requires repositories/PermissionRepository
 * @requires repositories/FeatureRepository
 * @requires repositories/SubscriptionLogRepository
 * @requires dtos/ResponseDTO
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-24
 */

const permisionRepo = require("../repositories/permissionRepository");
const subcriptionLogRepo = require("../repositories/subscriptionLogRepository");
const featureRepo = require("../repositories/featureRepository");
const ResponseDTO = require("../dtos/responseDTO");
const { getMessage } = require("../lang/i18n");

class PermissionService {
  /**
   * Retrieves all permissions with enriched Feature information.
   * Uses Promise.all for efficient parallel asynchronous data fetching.
   * @async
   * @param {string} lang - Language code for localized responses.
   * @returns {Promise<ResponseDTO>}
   */
  async getAllPermissions(lang) {
    try {
      const all = (await permisionRepo.getAllPermission()).map(r => r.get({ plain: true }));
      // 2. Dùng Promise.all để lấy featureName cho từng thằng cùng lúc
      const finalData = await Promise.all(
        all.map(async (perm) => {
          const feature = await featureRepo.getFeaturedById(perm.feature_id);
          return {
            ...perm, // Giữ lại các field cũ
            featureName: feature ? feature.name : "N/A", // Map thêm field mới
          };
        }),
      );
      return new ResponseDTO(getMessage(lang, "function.permission.get_permission_success"), 200, true, finalData);
    } catch (error) {
      return new ResponseDTO(getMessage(lang, "system.error.system_error"), 500, false);
    }
  }

  /**
   * Permanently removes a permission after verifying its existence.
   * @async
   * @param {number|string} id - Permission ID to delete.
   * @param {string} lang - Language code.
   * @returns {Promise<ResponseDTO>}
   */
  async deletePermission(id, lang) {
    try {
      const permission = await permisionRepo.getPermissionById(id);
      const result = await this.checkExist(permission);
      if (result === false) {
        return new ResponseDTO(getMessage(lang, "function.permission.permission_not_exists"), 404, false);
      }
      const savedPermission = await permisionRepo.deletePermission(permission);
      return new ResponseDTO(
        getMessage(lang, "function.permission.deleted_permission_success"),
        200,
        true,
        savedPermission,
      );
    } catch (error) {
      return new ResponseDTO(getMessage(lang, "system.error.system_error"), 500, false);
    }
  }

  /**
   * Creates a new permission.
   * Validates name uniqueness and existence of the associated Feature.
   * @async
   * @param {Object} data - Permission creation data.
   * @param {string} lang - Language code.
   * @returns {Promise<ResponseDTO>}
   */
  async createPermission(data, lang) {
    try {
      const existing = await permisionRepo.getPermissionByCondition({
        name: data.name,
      });

      if (existing && existing.length > 0) {
        return new ResponseDTO(
          getMessage(lang, "system.validation.validation"),
          400,
          false,
          null,
          { Name: [getMessage(lang, "function.permission.name_exists")] }, // Trả về đúng object errors ở đây
        );
      }

      const feature = await featureRepo.getFeaturedById(data.feature_id);
      if (!feature) {
        return new ResponseDTO(getMessage(lang, "system.error.not_found"), 404, false, null, {
          Name: [getMessage(lang, "function.feature.feature_not_exists")],
        });
      }

      const result = await permisionRepo.createPermission(data);

      //add subcription Log
      try {
        const subLog = {
          log_entry: `Created new permission: ${data.name}`,
          entity: "Permission",
        };
        await subcriptionLogRepo.createLog(subLog);
      } catch (error) {
        return new ResponseDTO(getMessage(lang, "system.error.system_error"), 500, false);
      }


      return new ResponseDTO(
        getMessage(lang, "function.permission.create_permission_success"),
        201,
        true,
        result,
      );
    } catch (error) {
      return new ResponseDTO(getMessage(lang, "system.error.system_error"), 500, false);
    }
  }

  /**
   * Updates an existing permission's attributes.
   * Enforces status integrity and prevents name duplication.
   * @async
   * @param {number|string} id - Target Permission ID.
   * @param {Object} updateData - Data to be updated.
   * @param {string} lang - Language code.
   * @returns {Promise<ResponseDTO>}
   */
  async updatePermission(id, updateData, lang) {
    try {
      if (updateData.status !== 1 && updateData.status !== 0) {
        return new ResponseDTO(getMessage(lang, "system.validation.validation"), 400, false, null,{ status: [getMessage(lang, "function.permission.status_wrong")] });
      }
      const permission = await permisionRepo.getPermissionById(id);
      
      const check = await this.checkExist(permission);
      if (check === false) {
        return new ResponseDTO(getMessage(lang, "function.permission.permission_not_exists"), 404, false);
      }

      if (updateData.name && updateData.name !== permission.name) {
        const duplicate = await permisionRepo.getPermissionByCondition({
          name: updateData.name,
        });
        if (duplicate.length > 0)
          return new ResponseDTO(getMessage(lang, "function.permission.name_exists"), 400, false);
      }

      const feature = await featureRepo.getFeaturedById(updateData.feature_id);
      if (!feature) {
        return new ResponseDTO(getMessage(lang, "system.error.not_found"), 404, false, null, {
          Name: [getMessage(lang, "function.feature.feature_not_exists")],
        });
      }

      const result = await permisionRepo.updatePermission(permission, updateData);

      try {
        const subLog = {
          log_entry: `Updated a permission: ${updateData.name}`,
          entity: "Permission",
        };
        await subcriptionLogRepository.createLog(subLog);
      } catch (error) {
        return new ResponseDTO(getMessage(lang, "system.error.system_error"), 500, false);
      }

      return new ResponseDTO(
        getMessage(lang, "function.permission.update_permission_success"),
        200,
        true,
        result,
      );
    } catch (error) {
      return new ResponseDTO(getMessage(lang, "system.error.system_error"), 500, false);
    }
  }

  /**
   * Internal helper to verify if a permission record exists.
   * @private
   */
  async checkExist(permission, lang) {
    if (!permission) {
      return false;
    }
  }
}

module.exports = new PermissionService();
