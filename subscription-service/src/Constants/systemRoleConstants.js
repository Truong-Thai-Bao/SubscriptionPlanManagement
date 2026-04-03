/**
 * System Role Constants Definition.
 * * This module defines the static identifiers for all user roles within the system.
 * Use these constants instead of hardcoded numeric IDs to ensure code maintainability 
 * and prevent "magic numbers" in business logic.
 * * @module constants/SystemRoles
 * @author Nguyễn Huỳnh Thanh Tâm
 * @since 2026-03-20
 * @see {@link Role} for the database model associated with these IDs.
 */

/**
 * @typedef {Object} SystemRoles
 * @property {number} SUPER_ADMIN - Root administrator with full system access (ID: 1).
 * @property {number} ORGANIZATION_ADMIN - Administrator for a specific organization/school (ID: 2).
 * @property {number} TEACHER - Instructor capable of creating courses and managing content (ID: 3).
 * @property {number} LEARNER - Student accessing course materials and taking assessments (ID: 4).
 * @property {number} MENTOR - Advisor providing guidance and feedback to learners (ID: 5).
 */

/** @type {SystemRoles} */
const SYSTEM_ROLES = {
    SUPER_ADMIN: 1,
    ORGANIZATION_ADMIN: 2,
    TEACHER: 3,
    LEARNER: 4,
    MENTOR: 5
};

module.exports = SYSTEM_ROLES;