'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('payment_methods', 'image', {
      type: Sequelize.STRING,
      validate: {
        len: [0, 255]
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('payment_methods', 'image')
  }
};
