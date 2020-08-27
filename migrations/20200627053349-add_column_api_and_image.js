'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('customers', 'api_token', {
      type: Sequelize.STRING,
      validate: {
        len: [0, 255]
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('customers', 'api_token')
  }
};
