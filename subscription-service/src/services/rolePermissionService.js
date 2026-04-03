/**
 * Role-Permission Mapping Service.
 * * This service manages the Many-to-Many relationship between Roles and Permissions.
 * It serves as the core logic for the Access Control List (ACL), ensuring that 
 * permissions are correctly assigned, updated, or revoked from specific system roles.
 * * Key capabilities:
 * - Complex relationship hydration (Mapping IDs to Role and Permission names).
 * - Conflict detection (Preventing duplicate permission assignments).
 * - Detailed audit logging for security compliance.
 * * @module services/RolePermissionService
 * @requires repositories/RoleRepository
 * @requires repositories/PermissionRepository
 * @requires repositories/RolePermissionRepository
 * @requires repositories/SubscriptionLogRepository
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-27
 */

const roleRepo = require("../repositories/roleRepository");
const permissionRepo = require("../repositories/permissionRepository");
const rolePermissionRepo = require("../repositories/rolePermissionRepository");
const subcriptionLogRepository = require("../repositories/subscriptionLogRepository");
const ResponseDTO = require("../dtos/responseDTO");
const { getMessage } = require("../lang/i18n");

class rolePermissionService {
    /**
     * Retrieves all role-permission mappings with full object names.
     * Performs parallel asynchronous lookups for associated Role and Permission entities.
     * @async
     * @param {string} lang - Language code.
     * @returns {Promise<ResponseDTO>}
     */
    async getAllRolePermissions(lang) {
        try {
            const all = (await rolePermissionRepo.getAllRolePermission()).map(r => r.get({ plain: true }));

            const finalData = await Promise.all(
                all.map(async (perm) => {
                    const role = await roleRepo.getRoleById(perm.role_id);
                    const permission = await permissionRepo.getPermissionById(perm.permission_id);
                    return {
                        ...perm, // Giữ lại các field cũ
                        roleName: role ? role.name : "N/A",
                        permissionName: permission ? permission.name : "N/A"
                    };
                }),
            );

            return new ResponseDTO(getMessage(lang, "function.role_permission.get_success"), 200, true, finalData);
        } catch (error) {
            return new ResponseDTO(getMessage(lang, "system.error.system_error"), 500, false);
        }
    }

    /**
     * Fetches all permissions assigned to a specific role.
     * @async
     * @param {number|string} role_id - The target Role ID.
     * @param {string} lang - Language code.
     * @returns {Promise<ResponseDTO>}
     */
    async getAllPermissionOfRole(role_id, lang) {
        try {
            const roleData = await rolePermissionRepo.getPermissionsByRoleId(role_id);

            if (!roleData) {
                return new ResponseDTO(getMessage(lang, "function.role.role_not_exists"), 404, false);
            }

            return new ResponseDTO(getMessage(lang, "function.role_permission.get_role_permission_success"), 200, true, roleData);
        } catch (error) {
            return new ResponseDTO(getMessage(lang, "system.error.system_error"), 500, false);
        }
    }

    /**
     * Revokes a permission from a role.
     * @async
     * @param {number|string} roleId - Target Role ID.
     * @param {number|string} permissionId - Target Permission ID to remove.
     * @param {string} lang - Language code.
     * @returns {Promise<ResponseDTO>}
     */
    async deletePermissionOfRole(roleId, permissionId, lang) {
        try {
            const rolePermission = await rolePermissionRepo.getRolePermissionByCondition({
                role_id: roleId,
                permission_id: permissionId
            })
            if (!rolePermission) {
                return new ResponseDTO(getMessage(lang, "function.role_permission.rolePermission_not_exist"), 400, false);
            }

            const result = await rolePermissionRepo.deleteRolePermission(rolePermission[0]);
            //await this.createLog(role.name, permission.name, "Assign permission", "to role");
            return new ResponseDTO(getMessage(lang, "function.role_permission.delete_permission_of_role_success"), 200, true, result);
        } catch (error) {
            return new ResponseDTO(getMessage(lang, "system.error.system_error"), 500, false);
        }
    }

    /**
     * Assigns a new permission to a role.
     * Validates existence of both entities and checks for existing assignments.
     * @async
     * @param {number|string} roleId 
     * @param {number|string} permissionId 
     * @param {string} lang 
     * @returns {Promise<ResponseDTO>}
     */
    async createPermissionOfRole(roleId, permissionId, lang) {
        try {
            const role = await roleRepo.getRoleById(roleId);
            const permission = await permissionRepo.getPermissionById(permissionId);
            if (role === null) {
                return new ResponseDTO(
                    getMessage(lang, "system.error.not_found"),
                    404,
                    false,
                    null,
                    {
                        Role: [getMessage(lang, "function.role.role_not_exists")]
                    }
                );
            }
            if (permission === null) {
                return new ResponseDTO(
                    getMessage(lang, "system.error.not_found"),
                    404,
                    false,
                    null,
                    {
                        Permission: [getMessage(lang, "function.permission.permission_not_exists")]
                    }
                );
            }

            const rolePermissionFind = await rolePermissionRepo.getRolePermissionByCondition({
                role_id: roleId,
                permission_id: permissionId
            });
            if (rolePermissionFind && rolePermissionFind.length > 0) {
                return new ResponseDTO(
                    getMessage(lang, "system.validation.validation"),
                    400,
                    false,
                    null,
                    {
                        PermissionRole: [getMessage(lang, "function.role_permission.role_permission_exist")]
                    }
                )
            }

            const rolePermission = {
                role_id: roleId,
                permission_id: permissionId
            };

            const result = await rolePermissionRepo.createRolePermission(rolePermission);
            await this.createLog(role.name, permission.name, "Assign permission", "to role");
            return new ResponseDTO(getMessage(lang, "function.role_permission.create_permission_of_role_success"), 201, true, result);
        } catch (error) {
            return new ResponseDTO(getMessage(lang, "system.error.system_error"), 500, false);
        }

    }

    /**
     * Updates an existing Role-Permission mapping.
     * Includes status validation and unique constraint checks.
     * @async
     * @param {number|string} id - The Mapping ID.
     * @param {Object} updateData - New role_id, permission_id, and status.
     * @param {string} lang 
     * @returns {Promise<ResponseDTO>}
     */
    async updatePermissionOfRole(id, updateData, lang) {
        try {
            if (updateData.status !== 0 && updateData.status !== 1) {
                return new ResponseDTO(getMessage(lang, "function.role.status_wrong"), 400, false);
            }

            const role = await roleRepo.getRoleById(updateData.role_id);
            if (role === null) {
                return new ResponseDTO(
                    getMessage(lang, "system.error.not_found"),
                    404,
                    false,
                    null,
                    {
                        Role: [getMessage(lang, "function.role.role_not_exists")]
                    }
                );
            }

            const permission = await permissionRepo.getPermissionById(updateData.permission_id);
            if (permission === null) {
                return new ResponseDTO(
                    getMessage(lang, "system.error.not_found"),
                    404,
                    false,
                    null,
                    {
                        Permission: [getMessage(lang, "function.permission.permission_not_exists")]
                    }
                );
            }

            const rolePermission = await rolePermissionRepo.getRolePermissionById(id);
            if (rolePermission === null) {
                return new ResponseDTO(
                    getMessage(lang, "system.error.not_found"),
                    404,
                    false,
                    null,
                    {
                        RolePermission: [getMessage(lang, "function.role_permission.rolePermission_not_exist")]
                    }
                );
            }

            const rolePermissionCheck = await rolePermissionRepo.getRolePermissionByCondition({
                role_id: updateData.role_id,
                permission_id: updateData.permission_id
            })
            if (rolePermissionCheck.length > 0 && rolePermissionCheck[0].id !== rolePermission.id) {
                return new ResponseDTO(getMessage(lang, "function.role_permission.role_permission_exist"), 400, false);
            }

            const result = await rolePermissionRepo.updateRolePermission(rolePermission, updateData);
            await this.createLog(role.name, permission.name, "Update permission", "to role")
            return new ResponseDTO(getMessage(lang, "function.role_permission.update_permission_of_role_success"), 200, true, result);
            
        } catch (error) {
            return new ResponseDTO(getMessage(lang, "system.error.system_error"), 500, false, null, error);
        }
    }

    /**
     * Generates a descriptive audit log for security-sensitive ACL changes.
     * @private
     */
    async createLog(roleName, permissionName, message1, message2) {
        try {
            const subLog = {
                log_entry: `${message1} ${permissionName} ${message2} ${roleName}`,
                entity: "Feature",
            };
            await subcriptionLogRepository.createLog(subLog);
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = new rolePermissionService();