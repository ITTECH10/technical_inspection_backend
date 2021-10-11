const express = require('express')
const authController = require('./../controllers/authController')
const vehicleController = require('./../controllers/vehicleController')
const paymentController = require('./../controllers/paymentController')

const router = express.Router()

// BELOW ROUTES ARE PROTECTED
router.use(authController.protect)

router.route('/files/:fileId')
    .delete(vehicleController.deleteVehicleFiles)

router.route('/images/:carId')
    .post(vehicleController.uploadVehicleImages)
    .get(vehicleController.getCarImages)

router.route('/:updateId')
    .patch(vehicleController.connectInsuranceHouse)

// PAYMENTS
router.route('/:carId/contracts/cash')
    .post(paymentController.createCashPayment)

router.route('/:carId/contracts/credit')
    .post(paymentController.createCreditPayment)

router.route('/:carId/contracts/leasing')
    .post(paymentController.createLeasingPayment)

router.route('/payments/:paymentId')
    .get(paymentController.getCorespondingPayment)

// REMEMBER LATER
// if encountering deletion issues check /:fileId route is first
router.route('/:id')
    .post(vehicleController.checkForFiles, vehicleController.createVehicle)
    .get(vehicleController.getMyVehicles)
    .put(vehicleController.updateVehicleInformation)
    .delete(vehicleController.deleteMyVehicles)

router.route('/car/:id')
    .get(vehicleController.getVehicle)

router.route('/selling/:id')
    .get(vehicleController.recommendVehicleToAdmin)

router.route('/selling/mark/:id')
    .put(vehicleController.markVehicleForSelling)

router.route('/selling/unmark/:id')
    .put(vehicleController.unmarkVehicleForSelling)

// CAR DAMAGE
router.route('/damage/:id')
    .post(vehicleController.reportVehicleDamage)

// ADMIN ROUTES BELLOW
router.use(authController.restrictTo('admin'))

router.route('/')
    .get(vehicleController.getAllVehicles)

module.exports = router