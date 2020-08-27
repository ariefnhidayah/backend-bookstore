const Sequelize = require('sequelize')
const db = require('../db')

const admin = db.define('admins', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    name: Sequelize.STRING,
    roleId: {
        type: Sequelize.INTEGER,
        references: {
            model: {
                tableName: 'roles'
            },
            key: 'id'
        }
    }
})

module.exports = admin