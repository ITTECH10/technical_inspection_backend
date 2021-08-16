const express = require('express')
const authController = require('./../controllers/authController')
const vehicleController = require('./../controllers/vehicleController')

const router = express.Router()

// BELOW ROUTES ARE PROTECTED
router.use(authController.protect)

router.route('/:fileId')
    .delete(vehicleController.deleteVehicleFiles)

router.route('/images/:carId')
    .post(vehicleController.uploadVehicleImages)
    .get(vehicleController.getCarImages)

router.route('/:updateId')
    .patch(vehicleController.connectInsuranceHouse)


// REMEMBER LATER
// if encountering deletion issues check /:fileId route is first
router.route('/:id')
    .post(vehicleController.checkForFiles, vehicleController.createVehicle)
    .get(vehicleController.getMyVehicles)
    .delete(vehicleController.deleteMyVehicles)

router.route('/car/:id')
    .get(vehicleController.getVehicle)


module.exports = router