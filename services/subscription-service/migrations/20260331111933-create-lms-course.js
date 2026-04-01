'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lms_courses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tenant_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      moodle_course_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'ID of ogriginal course on Moodle'
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'lms_categories', // reference to
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL' //If del category, course will bi null category
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      thumbnail_url: {
        type: Sequelize.STRING
      },
      average_rating: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0
      },
      tags: {
        type: Sequelize.STRING,
        comment: 'String type: reactjs,nodejs,frontend'
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'active'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('lms_courses');
  }
};