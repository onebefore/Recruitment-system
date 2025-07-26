'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('user_auth', 'role', {
      type: Sequelize.ENUM('company', 'seeker', 'admin'),
      allowNull: false
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('user_auth', 'role', {
      type: Sequelize.ENUM('company', 'seeker'),
      allowNull: false
    });
  }
}; 