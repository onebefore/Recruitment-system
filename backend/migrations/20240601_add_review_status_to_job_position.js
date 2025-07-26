'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('job_position', 'review_status', {
      type: Sequelize.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
      comment: '职位审核状态：pending待审核，approved已通过，rejected已驳回'
    });
    await queryInterface.addColumn('job_position', 'reject_reason', {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: '岗位审核驳回原因'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('job_position', 'review_status');
    await queryInterface.removeColumn('job_position', 'reject_reason');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_job_position_review_status";');
  }
}; 