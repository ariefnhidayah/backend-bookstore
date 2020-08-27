const Payment_methods = require('../../../models/Payment_method')
const Order = require('../../../models/Order')
const OrderBooks = require('../../../models/OrderBooks')
const Cart = require('../../../models/Cart')
const axios = require('axios')
const config = require('../../../config')

module.exports = {

    get_payments: async (req, res) => {
        try {
            await Payment_methods.findAll().then(response => {
                res.status(200).json({
                    status: 'success',
                    data: response
                })
            }).catch(err => {
                res.status(503).json({
                    status: 'error',
                    message: err.message
                })
            })
        } catch (error) {
            res.status(503).json({
                status: 'error',
                message: error.message
            })
        }
    },

    get_cost: async (req, res) => {
        const { city_id, weight } = req.body
        const destination = 456
        const couriers = ['jne', 'pos', 'tiki']

        const listShipp = couriers.map(courier => {
            return axios.post('https://api.rajaongkir.com/starter/cost', {
                origin: city_id,
                destination: destination,
                weight: weight,
                courier: courier
            }, {
                headers: {
                    key: config.rajaongkir
                }
            }).then(({data}) => {
                return data.rajaongkir.results
            }).catch(({message}) => {
                res.status(503).json({
                    status: 'error',
                    message: message
                })
            })
        })

        res.status(200).json({
            data: await Promise.all(listShipp).then(value => value),
            status: 'success'
        })
    },

    add_order: async (req, res) => {
        const {
            customerId,
            paymentMethodId,
            books,
            subtotal,
            totalPrice,
            shippingCost,
            address,
            cityId,
            provinceId,
            district,
            postcode,
            shippingCourier
        } = req.body

        
        let provinceData = await axios.get(`https://api.rajaongkir.com/starter/province?id=${provinceId}`, {
            headers: {
                key: config.rajaongkir
            }
        }).then(res => {
            const data = res.data
            return data
        })
        const province_name = provinceData.rajaongkir.results.province

        let cityData = await axios.get(`https://api.rajaongkir.com/starter/city?id=${cityId}`, {
            headers: {
                key: config.rajaongkir
            }
        }).then(res => {
            const data = res.data
            return data
        })
        const city_name = `${cityData.rajaongkir.results.type} ${cityData.rajaongkir.results.city_name}`

        // Create ORDER CODE
        const now = Date.now()
        const dateNow = new Date(now)
        let year = dateNow.getFullYear()
        let month = dateNow.getMonth() + 1
        let day = dateNow.getDate()
        let hour = dateNow.getHours()
        let minute = dateNow.getMinutes()
        let second = dateNow.getSeconds()
        let milisecond = dateNow.getMilliseconds()
        month = month.toString().length > 1 ? month : `0${month}`
        day = day.toString().length > 1 ? day : `0${day}`
        hour = hour.toString().length > 1 ? hour : `0${hour}`
        minute = minute.toString().length > 1 ? minute : `0${minute}`
        second = second.toString().length > 1 ? second : `0${second}`
        milisecond = milisecond.toString().length > 1 ? milisecond : `0${milisecond}`
        const orderCode = `INV/${year}${month}${day}/${hour}${minute}${second}${milisecond}`

        const transferCode = Math.floor(Math.random() * 899) + 100

        const order = await Order.create({
            code: orderCode,
            customerId: customerId,
            paymentMethodId: paymentMethodId,
            shipping_cost: shippingCost,
            status: 0,
            address: address,
            province: province_name,
            city: city_name,
            payment_status: 0,
            district: district,
            postcode: postcode,
            shipping_courier: shippingCourier,
            total_price: totalPrice,
            subtotal: subtotal,
            transfer_code: transferCode,
            total_plus_code: transferCode + totalPrice
        })

        if (order) {
            books.map( async (book) => {
                await OrderBooks.create({
                    bookId: book.id,
                    quantity: book.quantity,
                    price: book.price,
                    subtotal: book.subtotal,
                    orderId: order.id,
                    total_weight: book.total_weight
                }).then(res => {
                    return res
                })
            })
            await Cart.destroy({
                where: {
                    customerId: customerId
                }
            })
            res.status(200).json({
                status: 'success',
                id: order.id
            })
        } else {
            res.status(503).json({
                status: 'failed'
            })
        }
    }

}