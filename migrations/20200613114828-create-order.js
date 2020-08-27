'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('orders', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      code: {
        type: Sequelize.STRING
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
      bookId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'books'
          },
          key: 'id'
        }
      },
      paymentMethodId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'payment_methods'
          },
          key: 'id'
        }
      },
      quantity: Sequelize.INTEGER,
      shipping_cost: Sequelize.DOUBLE,
      total_price: Sequelize.DOUBLE,
      status: Sequelize.INTEGER,
      address: Sequelize.STRING,
      province: Sequelize.STRING,
      city: Sequelize.STRING,
      payment_image: Sequelize.STRING,
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
    return queryInterface.drop('orders')
  }
};
