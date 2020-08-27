'use strict';
const bcrypt = require('bcrypt')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('admins', [{
      username: 'admin',
      password: await bcrypt.hash('rahasia', 10),
      name: 'Arief Hidayah',
      roleId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('admins', null, {})
  }
};
