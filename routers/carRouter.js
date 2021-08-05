const express = require('express')
const authController = require('./../controllers/authController')
const vehicleController = require('./../controllers/vehicleController')

const router = express.Router()

// BELOW ROUTES ARE PROTECTED
router.use(authController.protect)

router.route('/:id')
.post(vehicleController.createVehicle)
.get(vehicleController.getMyVehicles)

module.exports = router