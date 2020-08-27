module.exports = {
    index: (req, res) => {
        res.status(202).json({
            message: 'Welcome to API'
        })
    }
}