const Sequelize = require('sequelize')
const db = require('../db')

const order_books = db.define('order_books', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    bookId: {
        type: Sequelize.INTEGER,
        references: {
            model: {
                tableName: 'books'
            },
            key: 'id'
        }
    },
    createdAt: {
        type: Sequelize.DATE
    },
    quantity: {
        type: Sequelize.INTEGER
    },
    price: {
        type: Sequelize.FLOAT
    },
    subtotal: {
        type: Sequelize.FLOAT
    },
    total_weight: Sequelize.FLOAT
})

module.exports = order_books