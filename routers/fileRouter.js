const express = require('express')
const authController = require('./../controllers/authController')
const imageController = require('./../controllers/imageController')

const router = express.Router()

router.use(authController.protect)

router.route('/:id')
    .post(imageController.checkForImages, imageController.createImage)

module.exports = router