const express = require('express')
const authController = require('./../controllers/authController')
const insuranceHouseController = require('./../controllers/insuranceHouseController')

const router = express.Router()

// BELLOW ROUTES ARE PROTECTED
router.use(authController.protect)

router.route('/')
.get(insuranceHouseController.getAllInsurances)
.post(insuranceHouseController.createInsuranceHouse)

module.exports = router