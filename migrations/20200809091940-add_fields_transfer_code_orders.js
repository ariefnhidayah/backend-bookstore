'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('orders', 'transfer_code', {
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn('orders', 'total_plus_code', {
        type: Sequelize.FLOAT
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
