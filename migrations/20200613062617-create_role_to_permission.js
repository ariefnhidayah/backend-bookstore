'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('role_to_permission', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      roleId: {
        references: {
          model: {
            tableName: 'roles'
          },
          key: 'id'
        },
        type: Sequelize.INTEGER
      },
      permissionId: {
        references: {
          model: {
            tableName: 'permissions'
          },
          key: 'id'
        },
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.drop("role_to_permission")
  }
};
