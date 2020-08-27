const Sequelize = require('sequelize')
const db = require('../db')

const order = db.define('orders', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    code: Sequelize.STRING,
    shipping_cost: Sequelize.DOUBLE,
    total_price: Sequelize.DOUBLE,
    status: Sequelize.STRING,
    address: Sequelize.STRING,
    province: Sequelize.STRING,
    city: Sequelize.STRING,
    payment_image: Sequelize.TEXT,
    paymentMethodId: {
        type: Sequelize.INTEGER,
        references: {
            model: {
                tableName: 'payment_methods'
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
    createdAt: {
        type: Sequelize.DATE
    },
    payment_status: {
        type: Sequelize.STRING
    },
    subtotal: Sequelize.FLOAT,
    district: Sequelize.TEXT,
    postcode: Sequelize.TEXT,
    shipping_courier: Sequelize.TEXT,
    transfer_code: Sequelize.INTEGER,
    total_plus_code: Sequelize.FLOAT
})

module.exports = order