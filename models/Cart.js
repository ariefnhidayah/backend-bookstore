const Sequelize = require('sequelize')
const db = require('../db')

const cart = db.define('carts', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    price: Sequelize.DOUBLE,
    quantity: Sequelize.INTEGER,
    total_price: Sequelize.DOUBLE,
    bookId: {
        type: Sequelize.INTEGER,
        references: {
            model: {
                tableName: 'books'
            },
            key: 'id'
        }
    },
    customerId: {
        type: Sequelize.INTEGER,
        references: {
            model: {
                tableName: 'customers'
            },
            key: 'id'
        }
    },
    total_weight: Sequelize.INTEGER
})

module.exports = cart