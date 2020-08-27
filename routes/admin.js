var express = require('express');
var router = express.Router();
const { upload, uploadMultiple } = require('../middlewares/multer')
const auth = require('../middlewares/auth')

const DashboardController = require('../controllers/admin/DashboardController')
const CategoryController = require('../controllers/admin/CategoryController')
const BookController = require('../controllers/admin/BookController')
const PaymentMethodController = require('../controllers/admin/PaymentMethodController')
const OrderController = require('../controllers/admin/OrderController')
const AuthController = require('../controllers/admin/AuthController')

router.get('/', function(req, res, next) {
    res.redirect('/admin/dashboard')
});

router.get('/login', AuthController.index)
router.post('/auth/login', AuthController.login)
router.get('/logout', AuthController.logout)

router.use(auth)

router.get('/dashboard', DashboardController.index)


// Category
router.get('/category', CategoryController.index)
router.get('/category/add', CategoryController.form_add)
router.post('/category', CategoryController.save_add)
router.put('/category', CategoryController.save_edit)
router.delete('/category/delete/:id', CategoryController.delete)


// Book
router.get('/book', BookController.index)
router.get('/book/add', BookController.form)
router.post('/book', upload, BookController.add)
router.get('/book/:id', BookController.form)
router.put('/book/:id', upload, BookController.edit)
router.delete('/book/:id', BookController.delete)

// Payment Method
router.get('/payment-method', PaymentMethodController.index)
router.get('/payment-method/add', PaymentMethodController.form)
router.post('/payment-method', upload, PaymentMethodController.add)
router.get('/payment-method/:id', PaymentMethodController.form)
router.put('/payment-method/:id', upload, PaymentMethodController.edit)
router.delete('/payment-method/:id', PaymentMethodController.delete)

// Order
router.get('/order', OrderController.index)
router.get('/order/:id', OrderController.detail)
router.put('/order/rejected/:id', OrderController.rejected)
router.put('/order/accepted/:id', OrderController.accepted)
router.put('/order/:id', OrderController.edit)
router.delete('/order/:id', OrderController.delete)

module.exports = router