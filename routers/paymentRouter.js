const express = require('express')
const authController = require('./../controllers/authController')
const paymentController = require('./../controllers/paymentController')

const router = express.Router()

// Routes bellow this middleware are protected
router.use(authController.protect)

// router.route('/cash/:vehicleId')
//     .post(paymentController.createCashPayment)

router.route('/credit')
    .post(paymentController.createCreditPayment)

router.route('/leasing')
    .post(paymentController.createLeasingPayment)

module.exports = router