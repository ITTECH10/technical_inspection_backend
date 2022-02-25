const express = require('express')
const authController = require('./../controllers/authController')
const paymentController = require('./../controllers/paymentController')

const router = express.Router()

// Routes bellow this middleware are protected
router.use(authController.protect)

router.route('/cash/:paymentId')
    .put(paymentController.updateCashPayment)

router.route('/credit/:paymentId')
    .put(paymentController.updateCreditPayment)

router.route('/leasing/:paymentId')
    .put(paymentController.updateLeasingPayment)

module.exports = router