const config = require('../../config')
const Order = require('../../models/Order')
const Payment_method = require('../../models/Payment_method')
const Customer = require('../../models/Customer')
const Book = require('../../models/Book')
const OrderBooks = require('../../models/OrderBooks')
const fs = require('fs-extra') //untuk mengelola file / folder
const path = require('path')

Payment_method.hasMany(Order, {
    foreignKey: 'paymentMethodId'
})
Customer.hasMany(Order, {
    foreignKey: 'customerId'
})
Order.belongsTo(Payment_method, {
    foreignKey: 'paymentMethodId'
})
Order.belongsTo(Customer, {
    foreignKey: 'customerId'
})
Order.hasMany(OrderBooks, {
    foreignKey: 'orderId'
})
Book.hasMany(OrderBooks, {
    foreignKey: 'bookId'
})
OrderBooks.belongsTo(Order, {
    foreignKey: 'orderId'
})
OrderBooks.belongsTo(Book, {
    foreignKey: 'bookId'
})

module.exports = {

    index: async (req, res) => {
        const view_path = 'order/index.ejs'
        const isJavascript = false
        const alertMessage = req.flash('alertMessage')
        const alertStatus = req.flash('alertStatus')
        const order = await Order.findAll({
            include: [{
                model: Customer,
                attributes: ['name']
            }, {
                model: Payment_method,
                attributes: ['name_bank']
            }],
            attributes: ['id', 'code', 'subtotal', 'shipping_cost', 'total_price', 'payment_status', 'status'],
            order: [
                ['id', 'desc']
            ],
        })
        const alert = {
            message: alertMessage,
            status: alertStatus
        }
        const data = {
            content: view_path,
            menu_active: 'order',
            title: `Pesanan - ${config.site_name}`,
            isJavascript,
            alert,
            order
        }
        res.render('admin/index', data)
    },

    detail: async (req, res) => {
        const { id } = req.params
        const view_path = 'order/detail.ejs'
        const isJavascript = true
        const srcJs = '/javascripts/order.js'
        const alertMessage = req.flash('alertMessage')
        const alertStatus = req.flash('alertStatus')
        const alert = {
            message: alertMessage,
            status: alertStatus
        }
        const order = await Order.findOne({
            where: {
                id: id
            },
            include: [{
                model: Customer,
                attributes: ['name']
            }, {
                model: Payment_method,
                attributes: ['name_bank']
            }],
            attributes: ['code', 'payment_image', 'address', 'province', 'city', 'district', 'postcode', 'status', 'payment_status', 'subtotal', 'shipping_courier', 'shipping_cost', 'total_price', 'id', 'transfer_code', 'total_plus_code']
        })
        
        if (order) {
            const order_books = await OrderBooks.findAll({
                where: {
                    orderId: id
                },
                include: [{
                    model: Book,
                    attributes: ['name']
                }]
            })
            const data = {
                content: view_path,
                menu_active: 'order',
                title: `Detail Pesanan ${order.code} - ${config.site_name}`,
                isJavascript,
                alert,
                order,
                srcJs,
                order_books
            }
            res.render('admin/index', data)
        } else {
            req.flash('alertMessage', 'Order tidak ada')
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/order')
        }
    },

    rejected: async (req, res) => {
        try {
            const { id } = req.params
            await Order.update({
                status: 3,
                payment_status: 2
            }, {
                where: {
                    id: id
                }
            })
            req.flash('alertMessage', 'Pesanan berhasil ditolak!')
            req.flash('alertStatus', 'success')
            res.redirect('/admin/order')
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/order')
        }
    },

    accepted: async (req, res) => {
        try {
            const { id } = req.params
            await Order.update({
                payment_status: 1,
                status: 4
            }, {
                where: {
                    id: id
                }
            })
            req.flash('alertMessage', 'Pesanan berhasil diterima!')
            req.flash('alertStatus', 'success')
            res.redirect('/admin/order')
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/order')
        }
    },

    edit: async (req, res) => {
        try {
            const { id } = req.params
            const { status } = req.body
            await Order.update({
                status: status
            }, {
                where: {
                    id: id
                }
            })
            if (status == 2) {
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
            }
            req.flash('alertMessage', 'Pesanan berhasil diubah!')
            req.flash('alertStatus', 'success')
            res.redirect('/admin/order')
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/order')
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params
            const order = await Order.findOne({ 
                where: {
                    id: id
                },
                attributes: ['id', 'payment_image']
            })
            if (order) {
                const deleteOrderBooks = await OrderBooks.destroy({
                    where: {
                        orderId: id
                    }
                })
                if (deleteOrderBooks) {
                    if (order.payment_image) {
                        await fs.unlink(path.join(`public/${order.payment_image}`))
                    }
                    await Order.destroy({
                        where: {
                            id: id
                        }
                    })
                    req.flash('alertMessage', 'Pesanan berhasil dihapus!')
                    req.flash('alertStatus', 'success')
                    res.redirect('/admin/order')
                } else {
                    req.flash('alertMessage', 'Terjadi kesalahan!')
                    req.flash('alertStatus', 'danger')
                    res.redirect('/admin/order')    
                }
            } else {
                req.flash('alertMessage', 'Pesanan tidak ada!')
                req.flash('alertStatus', 'danger')
                res.redirect('/admin/order')
            }
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/order')
        }
    }

}