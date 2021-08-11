const express = require('express')
const authController = require('./../controllers/authController')
const bankLeasingController = require('./../controllers/banksLeasingController')

const router = express.Router()

// BELLOW ROUTES ARE PROTECTED
router.use(authController.protect)

router.route('/')
.get(bankLeasingController.getAllBanks)
.post(bankLeasingController.createBanksLeasing)

module.exports = router