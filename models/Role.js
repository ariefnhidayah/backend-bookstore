const Sequelize = require('sequelize')
const db = require('../db')

const Admins = require('./Admin')
const Role_to_permission = require('./Role_to_permission')

const role = db.define('roles', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING
})

role.hasMany(Admins)
role.hasOne(Role_to_permission)

module.exports = role