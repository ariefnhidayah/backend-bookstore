const config = require('../config')
const jwt = require('jsonwebtoken')

const isAuth = (req, res, next) => {
    try {
        console.log(req.headers.token)
        const token = req.headers.token.split(' ')[1]
        const decoded = jwt.verify(token, config.api_token)
        req.user = decoded
        next()
    } catch (error) {
        res.status(401).json({
            message: 'Token is invalid!',
            status: 'failed'
        })
    }
}

module.exports = isAuth