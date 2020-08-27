'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('orders', 'district', {
        type: Sequelize.TEXT
      }),
      queryInterface.addColumn('orders', 'postcode', {
        type: Sequelize.TEXT
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('orders', 'district'),
      queryInterface.removeColumn('orders', 'postcode')
    ])
  }
};
