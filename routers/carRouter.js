const express = require('express')
const authController = require('./../controllers/authController')
const vehicleController = require('./../controllers/vehicleController')

const router = express.Router()

// BELOW ROUTES ARE PROTECTED
router.use(authController.protect)

router.route('/upload/:carId')
.post(vehicleController.uploadVehicleImages)

router.route('/:updateId')
.patch(vehicleController.connectInsuranceHouse)

router.route('/:id')
.post(vehicleController.checkForImages, vehicleController.createVehicle)
.get(vehicleController.getMyVehicles)
.delete(vehicleController.deleteMyVehicles)

router.route('/car/:id')
.get(vehicleController.getVehicle)

module.exports = router