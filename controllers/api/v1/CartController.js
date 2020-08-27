const Cart = require('../../../models/Cart')
const Book = require('../../../models/Book')
// const customer = require('../../../models/Customer')
const config = require('../../../config')
const axios = require('axios')

Book.hasMany(Cart, {
    foreignKey: 'bookId'
})
Cart.belongsTo(Book, {
    foreignKey: 'bookId'
})

module.exports = {
    add_cart: async (req, res) => {
        try {
            const { book_id, customer_id, qty } = req.body
            const book = await Book.findOne({
                where: {
                    id: book_id
                }
            })
            if (book) {
                if (qty <= book.stock) {
                    const cart = await Cart.findOne({
                        where: {
                            bookId: book_id,
                            customerId: customer_id
                        }
                    })
                    if (cart) {
                        await Cart.update({
                            quantity: Number(cart.quantity) + Number(qty),
                            total_price: cart.price * (Number(cart.quantity) + Number(qty)),
                            total_weight: book.weight * (Number(cart.quantity + Number(qty)))
                        }, {
                            where: {
                                id: cart.id
                            }
                        })
                    } else {
                        await Cart.create({
                            bookId: book_id,
                            customerId: customer_id,
                            price: book.price,
                            quantity: qty,
                            total_price: book.price * qty,
                            total_weight: book.weight * qty
                        })
                    }
                    res.status(200).json({
                        status: 'success',
                        message: 'Berhasil menambah buku!'
                    })
                } else {
                    res.status(200).json({
                        message: 'Stok tidak tersedia!',
                        status: 'failed'
                    })
                }
            } else {
                res.status(501).json({
                    message: "Terjadi suatu kesalahan!",
                    status: 'error'
                })
            }
        } catch (error) {
            res.status(503).json({
                message: error.message,
                status: 'error'
            })
        }
    },
    get_cart: async (req, res) => {
        try {
            const { customer_id } = req.body
            const cart = await Cart.findAll({
                where: {
                    customerId: customer_id
                },
                include: [{
                    model: Book
                }]
            })
            if (cart) {
                res.status(200).json({
                    status: 'success',
                    message: 'Berhasil',
                    data: cart
                })
            } else {
                res.status(501).json({
                    status: 'error',
                    message: 'Terjadi suatu kesalahan!'
                })
            }
        } catch (error) {
            res.status(503).json({
                message: error.message,
                status: 'error'
            })
        }
    },
    update_cart: async (req, res) => {
        try {
            const { id, qty, customer_id } = req.body
            const cart = await Cart.findOne({
                where: {
                    id: id,
                    customerId: customer_id
                }
            })
            if (cart) {
                const book = await Book.findOne({
                    where: {
                        id: cart.bookId
                    }
                })
                if (book) {
                    await Cart.update({
                        quantity: qty,
                        total_price: book.price * qty,
                        total_weight: book.weight * qty
                    }, {
                        where: {
                            id: cart.id
                        }
                    })
                    res.status(200).json({
                        status: 'success',
                        message: 'Berhasil update keranjang!'
                    })
                } else {
                    res.status(200).json({
                        status: 'failed',
                        message: 'Buku Kosong!'
                    })
                }
            } else {
                res.status(200).json({
                    status: 'failed',
                    message: 'Buku tidak ada dikeranjang!'
                })
            }
        } catch (error) {
            res.status(503).json({
                status: 'error',
                message: error.message
            })
        }
    },
    delete_cart: async (req, res) => {
        try {
            const { id, customer_id } = req.body
            const cart = await Cart.destroy({
                where: {
                    id: id,
                    customerId: customer_id
                }
            })
            if (cart) {
                res.status(200).json({
                    message: 'Buku berhasil dihapus!',
                    status: 'success'
                })
            } else {
                res.status(200).json({
                    status: 'failed',
                    message: 'Produk tidak ada dikeranjang!'
                })
            }
        } catch (error) {
            res.status(503).json({
                status: 'error',
                message: error.message
            })
        }
    },

    get_provincies: async(req, res) => {
        axios.get('https://api.rajaongkir.com/starter/province', {
            headers: {
                key: config.rajaongkir
            }
        }).then(response => {
            const data = response.data
            res.status(200).json({
                status: 'success',
                data: data
            })
        }).catch(err => {
            res.status(503).json({
                status: 'error',
                message: err.message
            })
        })
    },

    get_cities: async (req, res) => {
        const { province } = req.body
        axios.get(`https://api.rajaongkir.com/starter/city?province=${province}`, {
            headers: {
                key: config.rajaongkir
            }
        }).then(response => {
            const data = response.data
            res.status(200).json({
                status: 'success',
                data: data
            })
        }).catch(err => {
            res.status(503).json({
                status: 'error',
                message: err.message
            })
        })
    }
}