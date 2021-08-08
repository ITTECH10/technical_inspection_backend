const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const Vehicle = require('./../models/VehicleModel')
const cloudinary = require('cloudinary').v2
const {uploadSingleImage} = require('./../utils/cloudinary')
const Email = require('./../utils/nodemailer')

// MIDLEWARE FOR VEHICLE CREATION AND IMAGES
exports.checkForImages = catchAsync(async(req, res, next) => {
    if(req.files) {
        uploadSingleImage(req)

        await cloudinary.uploader.upload(req.files.joinedTemp, (err, img) => {
            if(img) {
                console.log(img)
                req.files.image = img.secure_url
            }
            if(err) {
                console.log(err)
            }
        })
    }

    console.log(req.body)

    next()
})

exports.createVehicle = catchAsync(async(req, res, next) => {
    const newVehicle = await Vehicle.create({
        vehicleOwner: req.params.id,
        model: req.body.model,
        image: req.files.image,
        modelDetails: req.body.modelDetails,
        lastTechnicalInspection: req.body.lastTechnicalInspection
    })

    // try{
    //     await new Email(req.user).carAdded()
    // }
    // catch(err) {
    //     console.log(err)
    // }

    res.status(201).json({
        message: 'success',
        newVehicle
    })
})

exports.getMyVehicles = catchAsync(async(req, res, next) => {
    const userVehicles = await Vehicle.find({vehicleOwner: req.params.id})

    if(!userVehicles) {
        return next(new AppError('No vehicles were found', 404))
    }

    res.status(200).json({
        message: 'success',
        userVehicles
    })
})

exports.uploadVehicleImages = catchAsync(async(req, res, next) => {
    if(req.files) {
        console.log(req.files.photo.length)
        uploadSingleImage(req)
        // console.log(req.files)
        await cloudinary.uploader.upload(req.files.joinedTemp, (err, img) => {
            if(img) {
                console.log(img)
                req.files.image = img.secure_url
            }
            if(err) {
                console.log(err)
            }
        })
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.carId, {image: req.files.image}, {
        new: true
    })

    res.status(201).json({
        message: 'success',
        updatedVehicle
    })
})

exports.deleteMyVehicles = catchAsync(async(req, res, next) => {
    await Vehicle.findByIdAndDelete(req.params.id)

    res.status(204).json({
        messag: 'success'
    })
})

