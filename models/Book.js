const Sequelize = require('sequelize')
const db = require('../db')

const Order = require('./Order')
const Cart = require('./Cart')

const book = db.define('books', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: Sequelize.STRING,
    author: Sequelize.STRING,
    description: Sequelize.TEXT,
    price: Sequelize.DOUBLE,
    stock: Sequelize.INTEGER,
    banner: Sequelize.BOOLEAN,
    categoryId: {
        type: Sequelize.INTEGER,
        references: {
            model: {
                tableName: 'categories'
            },
            key: 'id'
        }
    },
    image: {
        type: Sequelize.STRING,
        validate: {
            len: [0, 255]
        }
    },
    seo_url: Sequelize.STRING,
    weight: Sequelize.NUMBER
})

book.hasMany(Order)
book.hasMany(Cart)

// book.belongsTo(Category, {foreignKey: 'categoryId'})

module.exports = book