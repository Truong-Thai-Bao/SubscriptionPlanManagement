/**
 * Repository for Role-Permission mapping operations.
 * * This class manages the data access layer for the Many-to-Many relationship 
 * between Roles and Permissions. It handles direct junction table operations 
 * and provides complex retrieval methods using Eager Loading.
 * * @module repositories/RolePermissionRepository
 * @requires models/RolePermission
 * @requires models/index
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-27
 */

const RolePermission = require('../models/RolePermission');
const { Role, Permission } = require('../models/index');

class RolePermissionRepository {
    /**
     * Retrieves a Role along with its associated Permissions.
     * Uses Eager Loading to join tables and filters for specific attributes.
     * @async
     * @param {number|string} roleId - The ID of the role to fetch permissions for.
     * @returns {Promise<Role|null>} The Role instance with nested 'permissions' array.
     */
    async getPermissionsByRoleId(roleId) {
        return await Role.findByPk(roleId, {
            include: [{
                model: Permission,
                as: 'permissions',
                attributes: ['id', 'name', 'action'],
                through: { attributes: [] } // Excludes junction table metadata from results
            }]
        });
    }

    /**
     * Finds a specific mapping record by its Primary Key.
     * @async
     * @param {number|string} id - The unique ID of the junction record.
     * @returns {Promise<RolePermission|null>}
     */
    async getRolePermissionById(id) {
        return await RolePermission.findByPk(id);
    }

    /**
     * Lists all role-permission mappings.
     * @async
     * @returns {Promise<RolePermission[]>}
     */
    async getAllRolePermission() {
        return await RolePermission.findAll();
    }

    /**
     * Queries mappings based on dynamic conditions (e.g., specific role_id).
     * @async
     * @param {Object} condition - Sequelize 'where' clause.
     * @returns {Promise<RolePermission[]>}
     */
    async getRolePermissionByCondition(condition) {
        return await RolePermission.findAll({
            where: condition,
        });
    }

    /**
     * Persists an existing mapping instance.
     * @async
     * @param {RolePermission} instance - The model instance to save.
     * @returns {Promise<RolePermission>}
     */
    async saveRolePermission(instance) {
        return await instance.save();
    }

    /**
     * Creates a new role-to-permission association.
     * @async
     * @param {Object} data - Mapping data containing role_id and permission_id.
     * @returns {Promise<RolePermission>}
     */
    async createRolePermission(data) {
        return await RolePermission.create(data);
    }

    /**
     * Updates an existing mapping record.
     * @async
     * @param {RolePermission} instance - The existing instance.
     * @param {Object} data - New mapping data.
     * @returns {Promise<RolePermission>}
     */
    async updateRolePermission(instance, data) {
        await instance.set(data);
        return await instance.save();
    }

    /**
     * Deletes a mapping record (unlinks a permission from a role).
     * @async
     * @param {RolePermission} instance - The instance to destroy.
     * @returns {Promise<void>}
     */
    async deleteRolePermission(instance) {
        return await instance.destroy();
    }
}

module.exports = new RolePermissionRepository();