const express = require('express')
const authController = require('./../controllers/authController')
const userController = require('./../controllers/userController')

const router = express.Router()

router.route('/login')
.post(authController.login)

// BELLOW ROUTES ARE ALL PROTECTED
router.use(authController.protect)

router.route('/me')
.get(userController.getMyCredentials)

router.route('/:id')
.get(userController.getOneUser)
.patch(userController.editUserInfo)
.delete(userController.deleteUser)

// BELLOW ROUTES FOR ADMIN ONLY
router.use(authController.restrictTo('admin'))

router.route('/signup')
.post(authController.signup)

router.route('/')
.get(userController.getAllUsers)

module.exports = router