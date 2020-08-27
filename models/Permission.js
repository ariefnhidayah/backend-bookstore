const Sequelize = require('sequelize')
const db = require('../db')

const Role_to_permission = require('./Role_to_permission')

const permission = db.define('permissions', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING
})

permission.hasOne(Role_to_permission)

module.exports = permission