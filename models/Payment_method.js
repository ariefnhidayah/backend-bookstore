const Sequelize = require('sequelize')
const db = require('../db')

const payment_method = db.define('payment_methods', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name_bank: Sequelize.STRING,
    account_name: Sequelize.STRING,
    account_number: Sequelize.STRING,
    image: {
        type: Sequelize.STRING,
        validate: {
            len: [0, 255]
        }
    }
})

module.exports = payment_method