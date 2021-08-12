const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const Vehicle = require('./../models/VehicleModel')
const cloudinary = require('cloudinary').v2
const { uploadSingleImage } = require('./../utils/cloudinary')
const Email = require('./../utils/nodemailer')

// MIDLEWARE FOR VEHICLE CREATION AND IMAGES
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

exports.createVehicle = catchAsync(async (req, res, next) => {
    const newVehicle = await Vehicle.create({
        vehicleOwner: req.params.id,
        model: req.body.model,
        image: req.files ? req.files.image : req.body.image,
        mark: req.body.mark,
        HSN: req.body.HSN,
        TSN: req.body.TSN,
        kilometersDriven: req.body.kilometersDriven,
        // insuranceHouse: req.body.insuranceHouse,
        monthlyInsurancePayment: req.body.monthlyInsurancePayment,
        allowedYearlyKilometers: req.body.allowedYearlyKilometers,
        // vehiclePaymentType: req.body.vehiclePaymentType,
        yearlyTax: req.body.yearlyTax
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

exports.getMyVehicles = catchAsync(async (req, res, next) => {
    const userVehicles = await Vehicle.find({ vehicleOwner: req.params.id })

    if (!userVehicles) {
        return next(new AppError('No vehicles were found', 404))
    }

    res.status(200).json({
        message: 'success',
        userVehicles
    })
})

exports.uploadVehicleImages = catchAsync(async (req, res, next) => {
    if (req.files) {
        uploadSingleImage(req)
        // console.log(req.files)
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

    const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.carId, { image: req.files.image }, {
        new: true
    })

    res.status(201).json({
        message: 'success',
        updatedVehicle
    })
})

exports.deleteMyVehicles = catchAsync(async (req, res, next) => {
    await Vehicle.findByIdAndDelete(req.params.id)

    res.status(204).json({
        messag: 'success'
    })
})

exports.connectInsuranceHouse = catchAsync(async (req, res, next) => {
    const vehicle = await Vehicle.findById(req.params.updateId)

    if (!vehicle) {
        return next(new AppError('No vehicle was found', 404))
    }

    vehicle.insuranceHouse = req.body.insuranceHouse || vehicle.insuranceHouse
    vehicle.vehiclePaymentType = req.body.vehiclePaymentType || vehicle.vehiclePaymentType

    await vehicle.save({
        new: true,
        validateBeforeSave: false
    })

    res.status(202).json({
        message: 'success',
        vehicle
    })
})

exports.getVehicle = catchAsync(async (req, res, next) => {
    const vehicle = await Vehicle.findById(req.params.id)

    if (!vehicle) {
        return next(new AppError('There is no vehicle found', 404))
    }

    res.status(200).json({
        message: 'success',
        vehicle
    })
})
