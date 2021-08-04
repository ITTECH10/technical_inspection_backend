const express = require('express')
const authController = require('./../controllers/authController')
const userController = require('./../controllers/userController')

const router = express.Router()

router.route('/login')
.post(authController.login)

router.use(authController.protect)

router.route('/me')
.get(userController.getMyCredentials)

router.use(authController.restrictTo('admin'))

router.route('/signup')
.post(authController.signup)

router.route('/')
.get(userController.getAllUsers)

router.route('/:id')
.get(userController.getOneUser)
.patch(userController.editUserInfo)

module.exports = router