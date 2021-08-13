const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const Image = require('./../models/ImageModel')

// MIDLEWARE FOR IMAGES
exports.checkForImages = catchAsync(async (req, res, next) => {
    // if(!req.files) next()
    if (req.files) {
        uploadSingleImage(req)

        await cloudinary.uploader.upload(req.files.joinedTemp, (err, img) => {
            if (img) {
                // console.log(img)
                req.files.image = img.secure_url
            }
            if (err) {
                console.log(err)
            }
        })
    }

    next()
})

exports.createImage = catchAsync(async (req, res, next) => {
    const newImage = await Image.create({
        uploadedFor: req.params.id,
        image: req.files ? req.files.image : req.body.image
    })

    res.status(201).json({
        message: 'success',
        newImage
    })
})
