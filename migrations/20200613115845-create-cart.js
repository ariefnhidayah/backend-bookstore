'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('carts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      bookId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'books'
          },
          key: 'id'
        }
      },
      customerId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'customers'
          },
          key: 'id'
        }
      },
      price: Sequelize.DOUBLE,
      quantity: Sequelize.INTEGER,
      total_price: Sequelize.DOUBLE,
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

  down: (queryInterface, Sequelize) => {
    return queryInterface.drop('carts')
  }
};
