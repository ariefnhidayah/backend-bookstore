const Sequelize = require('sequelize')
const db = require('../db')

const customer = db.define('customers', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    password: Sequelize.STRING,
    email: Sequelize.STRING,
    name: Sequelize.STRING,
    api_token: {
        type: Sequelize.STRING,
        validate: {
            len: [0, 255]
        }
    }
})

module.exports = customer