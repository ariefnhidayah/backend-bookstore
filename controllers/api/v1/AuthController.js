const Customer = require('../../../models/Customer')
const bcrypt = require('bcrypt')
const config = require('../../../config')
const jwt = require('jsonwebtoken')

module.exports = {
    register: async (req, res) => {
        try {
            const { email, name, password } = req.body
            const checkEmail = await Customer.findOne({
                where: {
                    email: email
                }
            })
            if (checkEmail) { 
                res.status(200).json({
                    status: 'failed',
                    message: 'Email telah digunakan!'
                })
            } else {
                const customer = await Customer.create({
                    email,
                    name,
                    password: await bcrypt.hash(password, 10)
                })
                if (customer) {
                    res.status(200).json({
                        message: 'Registrasi berhasil!',
                        api_token: await jwt.sign({id: customer.id}, config.api_token),
                        data: customer,
                        status: 'success'
                    })
                } else {
                    res.status(503).json({
                        message: 'Terjadi suatu kesalahan',
                        status: 'error'
                    })
                }
            }
        } catch (error) {
            res.status(501).json({
                message: error.message,
                status: 'error'
            })
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body
            const customer = await Customer.findOne({
                where: {
                    email: email
                }
            })
            if (customer) {
                const isPasswordMatch = await bcrypt.compare(password, customer.password)
                if (!isPasswordMatch) {
                    res.status(200).json({
                        status: 'failed',
                        message: 'Password salah!'
                    })
                } else {
                    res.status(200).json({
                        status: 'success',
                        message: 'Berhasil login!',
                        data: customer,
                        api_token: await jwt.sign({id: customer.id}, config.api_token)
                    })
                }
            } else {
                res.status(200).json({
                    status: 'failed',
                    message: 'Email belum terdaftar!'
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