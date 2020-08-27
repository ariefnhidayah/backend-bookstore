const Book = require('../../../models/Book')

module.exports = {
    getBook: async (req, res) => {
        try {
            const { url } = req.params
            const book = await Book.findOne({
                where: {
                    seo_url: url
                }
            })
            if(book) {
                res.status(200).json({
                    message: 'Success',
                    data: book,
                    status: 'success'
                })
            } else {
                res.status(404).json({
                    message: 'Not Found',
                    status: 'error'
                })
            }
        } catch (error) {
            res.status(503).json({
                message: error.message,
                status: 'error'
            })
        }
    }
}