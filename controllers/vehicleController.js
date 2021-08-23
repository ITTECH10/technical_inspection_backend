const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const Vehicle = require('./../models/VehicleModel')
const cloudinary = require('cloudinary').v2
const { uploadSingleFile } = require('./../utils/cloudinary')
const Email = require('./../utils/nodemailer')
const File = require('./../models/FileModel')

// MIDLEWARE FOR IMAGES
exports.checkForFiles = catchAsync(async (req, res, next) => {
    // if(!req.files) next()
    if (req.files) {
        uploadSingleFile(req)

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
        thumbnail: req.files ? req.files.image : req.body.image,
        mark: req.body.mark,
        HSN: req.body.HSN,
        TSN: req.body.TSN,
        kilometersDriven: req.body.kilometersDriven,
        registrationNumber: req.body.registrationNumber,
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

exports.getAllVehicles = catchAsync(async (req, res, next) => {
    const vehicles = await Vehicle.find()

    if (!vehicles) {
        return next(new AppError('There are no vehicles found', 404))
    }

    res.status(200).json({
        message: 'success',
        vehicles
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
        uploadSingleFile(req)
        // console.log(req.files)
        await cloudinary.uploader.upload(req.files.joinedTemp, (err, file) => {
            if (file) {
                req.files.file = file.secure_url
                req.files.format = file.format
                req.files.fileName = req.files.photo.name
            }
            if (err) {
                console.log(err)
            }
        })
    }

    const newFile = await File.create({
        uploadedFor: req.params.carId,
        url: req.files ? req.files.file : req.body.image,
        format: req.files ? req.files.format : req.body.format,
        name: req.files ? req.files.fileName : req.body.fileName
    })

    // OLD LOGIC
    // const vehicle = await Vehicle.findById(req.params.carId)

    // const newImages = [
    //     ...vehicle.images,
    //     {
    //         newImage: req.files.image,
    //         createdAt: Date.now()
    //     }
    // ]

    // vehicle.images = newImages

    // await vehicle.save({
    //     new: true,
    //     validateBeforeSave: false
    // })

    res.status(201).json({
        message: 'success',
        newFile
    })
})

exports.getCarImages = catchAsync(async (req, res, next) => {
    const images = await File.find({ uploadedFor: req.params.carId })

    if (!images) {
        return next(new AppError('No images for this car found.', 404))
    }

    res.status(200).json({
        message: 'success',
        images
    })
})

exports.deleteMyVehicles = catchAsync(async (req, res, next) => {
    await Vehicle.findByIdAndDelete(req.params.id)

    res.status(204).json({
        message: 'success'
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

exports.deleteVehicleFiles = catchAsync(async (req, res, next) => {
    await File.findByIdAndDelete(req.params.fileId)

    // await cloudinary.v2.uploader.destroy('sample', function(error,result) {
    //     console.log(result, error) });

    res.status(204).json({
        message: 'success'
    })
})
