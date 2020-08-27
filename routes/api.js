const express = require('express')
const router = express.Router()
const { uploadConfirmImage, uploadMultiple } = require('../middlewares/multer')
const auth = require('../middlewares/authUser')

// V1
const IndexController = require('../controllers/api/IndexController')
const AuthControllerV1 = require('../controllers/api/v1/AuthController')
const LandingPageV1 = require('../controllers/api/v1/LandingPageController')
const BookDetailV1 = require('../controllers/api/v1/BookDetailController')
const CartV1 = require('../controllers/api/v1/CartController')
const CheckoutV1 = require('../controllers/api/v1/CheckoutController')
const OrderV1 = require('../controllers/api/v1/OrderController')

router.get('/', IndexController.index)

// Authentication Login & Register
router.post('/v1/auth/register', AuthControllerV1.register)
router.post('/v1/auth/login', AuthControllerV1.login)

// Landing Page
router.get('/v1/landing-page/books', LandingPageV1.books)
router.post('/v1/landing-page/more-books', LandingPageV1.more_books)
router.get('/v1/landing-page/banner', LandingPageV1.banner)
router.get('/v1/landing-page/count-product', LandingPageV1.count_all)

// Get Book
router.get('/v1/book/:url', BookDetailV1.getBook)

// Get Provincies
router.get('/v1/cart/get-provincies', CartV1.get_provincies)
router.post('/v1/cart/get-cities', CartV1.get_cities)

router.use(auth)

router.post('/v1/test-auth', function(req, res) {
    res.status(200).json({
        message: 'Success'
    })
})

router.post('/v1/cart/add', CartV1.add_cart)
router.post('/v1/cart/get', CartV1.get_cart)
router.post('/v1/cart/update', CartV1.update_cart)
router.post('/v1/cart/delete', CartV1.delete_cart)

router.get('/v1/checkout/get-payment', CheckoutV1.get_payments)
router.post('/v1/checkout/get-cost', CheckoutV1.get_cost)
router.post('/v1/checkout/add-order', CheckoutV1.add_order)


// Order
router.post('/v1/order/detail', OrderV1.get_order_detail)
router.post('/v1/order', OrderV1.get_orders)

router.post('/v1/confirm-payment', uploadConfirmImage, OrderV1.confirm_payment)
router.post('/v1/confirm-product', OrderV1.confirm_product)

module.exports = router