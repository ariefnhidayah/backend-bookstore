const Sequelize = require('sequelize')
const db = require('../db')

const category = db.define('categories', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: Sequelize.STRING
})

module.exports = category