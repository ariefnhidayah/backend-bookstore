const Sequelize = require('sequelize')
const db = require('../db')

const role_to_permission = db.define('role_to_permission', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    roleId: {
        type: Sequelize.INTEGER,
        references: {
            model: {
                tableName: 'roles'
            },
            key: 'id'
        }
    },
    permissionId: {
        type: Sequelize.INTEGER,
        references: {
            model: {
                tableName: 'permissions'
            },
            key: 'id'
        }
    }
})

module.exports = role_to_permission