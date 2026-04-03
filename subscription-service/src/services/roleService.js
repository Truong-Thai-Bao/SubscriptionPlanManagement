/**
 * Role Management Service.
 * * This service handles the core business logic for user roles within the system.
 * It provides administrative capabilities to define, modify, and audit the 
 * primary organizational groups used for access control.
 * * Key features:
 * - Unique role name enforcement.
 * - Integrity validation (ensuring roles exist before modification).
 * - Comprehensive audit logging for role-related activities.
 * * @module services/RoleService
 * @requires repositories/RoleRepository
 * @requires repositories/SubscriptionLogRepository
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-24
 */

const roleRepository = require("../repositories/roleRepository");
const subcriptionLogRepository = require("../repositories/subscriptionLogRepository");
const ResponseDTO = require("../dtos/responseDTO");
const { getMessage } = require("../lang/i18n");

class RoleService {
  /**
   * Retrieves all defined roles in the system.
   * @async
   * @param {string} lang - Language code for internationalized responses.
   * @returns {Promise<ResponseDTO>}
   */
  async getAllRoles(lang) {
    try {
      const all = await roleRepository.getAllRole();
      return new ResponseDTO(getMessage(lang, "function.role.get_role_success"), 200, true, all);
    } catch (error) {
      return new ResponseDTO(getMessage(lang, "system.error.system_error"), 500, false);
    }
  }

  /**
   * Creates a new system role.
   * Performs uniqueness checks and initiates an audit log entry upon success.
   * @async
   * @param {Object} data - Role creation attributes.
   * @param {string} lang - Language code.
   * @returns {Promise<ResponseDTO>}
   */
  async createRole(data, lang) {
    try {
      const existingRole = await roleRepository.getRoleByCondition({
        name: data.name,
      });

      if (existingRole && existingRole.length > 0) {
        return new ResponseDTO(
          getMessage(lang, "system.validation.validation"),
          400,
          false,
          null,
          { Name: [getMessage(lang, "function.role.name_exists")] }, // Trả về đúng object errors ở đây
        );
      }
      const datanew = await roleRepository.createRole(data);
      const { id, ...resultWithoutId } = datanew.toJSON ? datanew.toJSON() : datanew;

      //Add subcription log
      try {
        const subLog = {
          log_entry: `Created new role: ${data.name}`,
          entity: "Role",
        };
        await subcriptionLogRepository.createLog(subLog);
      } catch (error) {
        return new ResponseDTO(getMessage(lang, "system.error.system_error"), 500, false);
      }

      return new ResponseDTO(
        getMessage(lang, "function.role.create_role_success"),
        201,
        true,
        resultWithoutId,
      );
    } catch (error) {
      return new ResponseDTO(getMessage(lang, "system.error.system_error"), 500, false);
    }
  }

  /**
   * Updates an existing role's metadata and status.
   * Includes strict validation for status codes and duplicate name prevention.
   * @async
   * @param {number|string} id - The role identifier.
   * @param {Object} updateData - New role values.
   * @param {string} lang - Language code.
   * @returns {Promise<ResponseDTO>}
   */
  async updateRole(id, updateData, lang) {
    try {
      if (updateData.status !== 1 && updateData.status !== 0) {
       return new ResponseDTO(getMessage(lang, "system.validation.validation"), 400, false, null, { status: [getMessage(lang, "function.role.status_wrong")] });
      }

      const role = await roleRepository.getRoleById(id);
      
      const check = await this.checkExist(role);
      if (check === false) {
        return new ResponseDTO(getMessage(lang, "function.role.role_not_exists"), 404, false);
      }

      // Logic check trùng tên khi update
      if (updateData.name && updateData.name !== role.name) {
        const duplicate = await roleRepository.getRoleByCondition({
          name: updateData.name,
        });
        if (duplicate.length > 0)
          return new ResponseDTO(
            getMessage(lang, "system.validation.validation"),
            400,
            false,
            null,
            { Name: [getMessage(lang, "function.role.name_exists")] }, // Trả về đúng object errors ở đây
          );
      }

      try {
        const subLog = {
          log_entry: `Updated a role: ${updateData.name}`,
          entity: "Role",
        };
        await subcriptionLogRepository.createLog(subLog);
      } catch (error) {
        return new ResponseDTO(getMessage(lang, "system.error.system_error"), 500, false);
      }

      const result = await roleRepository.updateRole(role, updateData);

      return new ResponseDTO(getMessage(lang, "function.role.update_role_success"), 200, true, result);
    } catch (error) {
      return new ResponseDTO(getMessage(lang, "system.error.system_error"), 500, false);
    }
  }

  /**
   * Removes a role from the system.
   * @async
   * @param {number|string} id - The role identifier.
   * @param {string} lang - Language code.
   * @returns {Promise<ResponseDTO>}
   */
  async deleteRole(id, lang) {
    try {
      const role = await roleRepository.getRoleById(id);
      const check = await this.checkExist(role);
      if (check === false) {
        return new ResponseDTO(getMessage(lang, "function.role.role_not_exists"), 404, false);
      }
      const deletedRole = await roleRepository.deleteRole(role);
      return new ResponseDTO(
        getMessage(lang, "function.role.delete_role_success"),
        200,
        true,
        deletedRole,
      );
    } catch (error) {
      return new ResponseDTO(getMessage(lang, "system.error.system_error"), 500, false);
    }
  }
/**
   * Internal utility to check if a role exists and is currently active.
   * @private
   */
  async checkExist(role, lang) {
    if (!role || role.status === 0) {
      return false;
    }
  }
}

module.exports = new RoleService();
