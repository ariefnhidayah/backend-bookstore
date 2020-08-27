const Payment_method = require('../../../models/Payment_method')
const Order = require('../../../models/Order')
const OrderBooks = require('../../../models/OrderBooks')
const Book = require('../../../models/Book')

Payment_method.hasMany(Order, {
    foreignKey: 'paymentMethodId'
})

Order.belongsTo(Payment_method, {
    foreignKey: 'paymentMethodId'
})

Book.hasMany(OrderBooks, {
    foreignKey: 'bookId'
})

OrderBooks.belongsTo(Book, {
    foreignKey: 'bookId'
})

module.exports = {
    get_order_detail: async (req, res) => {
        try {
            const { id, customer_id } = req.body

            const order = await Order.findOne({
                where: {
                    id: id,
                    customerId: customer_id
                },
                include: [{
                    model: Payment_method,
                    attributes: ['name_bank', 'account_name', 'account_number']
                }],
                attributes: ['id', 'code', 'customerId', 'paymentMethodId', 'shipping_cost', 'total_price', 'status', 'address', 'province', 'city', 'payment_image', 'payment_status', 'subtotal', 'district', 'postcode', 'shipping_courier', 'transfer_code', 'total_plus_code']
            })

            if (order) {
                const orderBooks = await OrderBooks.findAll({
                    where: {
                        orderId: order.id
                    },
                    include: [{
                        model: Book,
                        attributes: ['name', 'seo_url', 'image']
                    }]
                })
                if (orderBooks) {
                    res.status(200).json({
                        status: 'success',
                        data: {
                            order,
                            order_books: orderBooks
                        }
                    })
                } else {
                    res.status(200).json({
                        status: 'error',
                        message: 'Pesanan Buku tidak ada!'
                    })
                }
            } else {
                res.status(200).json({
                    status: 'error',
                    message: 'Pesanan tidak ada!'
                })
            }

        } catch (error) {
            res.status(503).json({
                status: 'error',
                message: error.message
            })
        }
    },

    get_orders: async (req, res) => {
        try {
            const { customer_id, offset, limit } = req.body

            const orders = await Order.findAndCountAll({
                where: {
                    customerId: customer_id
                },
                offset: Number(offset),
                limit: Number(limit),
                order: [
                    ['id', 'desc']
                ],
                attributes: ['id', 'code', 'customerId', 'paymentMethodId', 'shipping_cost', 'total_price', 'status', 'address', 'province', 'city', 'payment_image', 'payment_status', 'subtotal', 'district', 'postcode', 'shipping_courier', 'transfer_code', 'total_plus_code', 'createdAt']
            })
            let returnData = []
            if (orders.count > 0) {
                orders.rows.map(order => {
                    returnData.push(order.get({ plain: true }))
                })

                for(let i = 0; i < returnData.length; i++) {
                    let orderProduct = await OrderBooks.findAll({
                        where: {
                            orderId: returnData[i].id
                        },
                        include: [{
                            model: Book,
                            attributes: ['name', 'seo_url', 'image']
                        }]
                    }).map(product => product.get({plain: true}))
                    returnData[i].products = orderProduct
                }

                res.status(200).json({
                    status: 'success',
                    data: returnData,
                    count: orders.count
                })
            } else {
                res.status(200).json({
                    status: 'not found',
                    message: 'Order Kosong!'
                })
            }
            
        } catch (error) {
            res.status(503).json({
                status: 'error',
                message: error.message
            })
        }
    },

    confirm_payment: async (req, res) => {
        try {
            const { id } = req.body

            if (req.file == undefined) {
                res.status(200).json({
                    status: 'failed',
                    message: 'Bukti pembayaran harus ada!'
                })
            } else {
                const order = await Order.findOne({ where: {id: id}, attributes: ['id']})
                if (order) {
                    await Order.update({
                        status: 4,
                        payment_status: 1,
                        payment_image: `confirm_image/${req.file.filename}`
                    }, {
                        where: {
                            id: id
                        }
                    })
                    res.status(200).json({
                        status: 'success',
                        message: 'Bukti pembayaran berhasil diupload!'
                    })
                } else {
                    res.status(200).json({
                        status: 'failed',
                        message: 'Order tidak tersedia!'
                    })
                }
            }
        } catch (error) {
            res.status(503).json({
                status: 'error',
                message: error.message
            })
        }
    },

    confirm_product: async (req, res) => {
        try {
            const { id } = req.body
            const order = await Order.findOne({ where: {id: id}, attributes: ['id']})
            if (order) {
                await Order.update({
                    status: 2
                }, {
                    where: {
                        id: id
                    }
                })
                const orderBooks = await OrderBooks.findAll({
                    where: {
                        orderId: id
                    }
                })
                if (orderBooks) {
                    orderBooks.map(async (orderBook) => {
                        const book = await Book.findOne({
                            where: {
                                id: orderBook.bookId
                            }
                        })
                        if (book) {
                            await Book.update({
                                stock: book.stock - orderBook.quantity
                            }, {
                                where: {
                                    id: book.id
                                }
                            })
                        }
                    })
                }
                res.status(200).json({
                    status: 'success',
                    message: 'Pesanan selesai!'
                })
            } else {
                res.status(200).json({
                    status: 'failed',
                    message: 'Pesanan tidak ada!'
                })
            }
        } catch (error) {
            res.status(503).json({
                status: 'error',
                message: error.message
            })
        }
    }
}