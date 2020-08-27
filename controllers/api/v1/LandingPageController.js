const Book = require('../../../models/Book')
const { Op, Sequelize } = require("sequelize");

module.exports = {
    books: async (req, res) => {
        try {
            const book = await Book.findAll({
                order: [
                    ['createdAt', 'DESC']
                ],
                limit: 8,
                attributes: ['id', 'name', 'price', 'image', 'seo_url', 'stock', 'createdAt']
            })
            if (book) {
                res.status(200).json({
                    status: 'success',
                    message: 'Success',
                    data: book
                })
            } else {
                res.status(503).json({
                    status: 'error',
                    message: 'Terjadi suatu kesalahan!'
                })
            }
        } catch (error) {
            res.status(501).json({
                status: 'error',
                message: error.message
            })
        }
    },

    more_books: async (req, res) => {
        try {
            const { createdAt } = req.body
            const books = await Book.findAll({
                limit: 8,
                order: [
                    ['createdAt', 'DESC']
                ],
                where: {
                    createdAt: {
                        [Op.lt]: createdAt
                    }
                },
                attributes: ['id', 'name', 'price', 'image', 'seo_url', 'stock', 'createdAt']
            })
            if (books) {
                res.status(200).json({
                    status: 'success',
                    data: books,
                    message: 'Success'
                })
            } else {
                res.status(503).json({
                    status: 'error',
                    message: 'Terjadi suatu kesalahan'
                })
            }
        } catch (error) {
            res.status(501).json({
                status: 'error',
                message: error.message
            })
        }
    },

    banner: async (req, res) => {
        try {
            const banner = await Book.findAll({
                attributes: ['id', 'name', 'author', 'image', 'seo_url'],
                where: {
                    banner: 1
                },
                order: [Sequelize.literal('rand()')],
                limit: 1
            })
            if (banner) {
                res.status(200).json({
                    status: 'success',
                    message: 'Success',
                    data: banner
                })
            } else {
                res.status(503).json({
                    status: 'error',
                    message: 'Terjadi suatu kesalahan!!'
                })
            }
        } catch (error) {
            res.status(501).json({
                status: 'error',
                message: error.message
            })
        }
    },

    count_all: async (req, res) => {
        try {
            const count = await Book.count()
            if (count) {
                res.status(200).json({
                    status: 'success',
                    message: 'Success',
                    data: count
                })
            } else {
                res.status(503).json({
                    status: 'error',
                    message: 'Terjadi suatu kesalahan!'
                })
            }
        } catch (error) {
            res.status(501).json({
                status: 'error',
                message: error.message
            })
        }
    }
}