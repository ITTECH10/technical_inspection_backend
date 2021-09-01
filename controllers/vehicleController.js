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
        TUV: req.body.TUV,
        TUVExpiresInOneMonth: new Date(req.body.TUV) > new Date() && new Date(req.body.TUV) < new Date(new Date().setMonth(new Date().getMonth() + 1)),
        TUVExpiresInFourteenDays: new Date(req.body.TUV) > new Date() && new Date(req.body.TUV) < new Date(new Date().setDate(new Date().getDate() + 14)),
        firstVehicleRegistration: req.body.firstVehicleRegistration,
        firstVehicleRegistrationOnOwner: req.body.firstVehicleRegistrationOnOwner,
        lastTechnicalInspection: req.body.lastTechnicalInspection,
        nextTechnicalInspection: req.body.nextTechnicalInspection,
        AU: req.body.AU,
        kilometersDriven: req.body.kilometersDriven,
        registrationNumber: req.body.registrationNumber,
        monthlyInsurancePayment: req.body.monthlyInsurancePayment,
        allowedYearlyKilometers: req.body.allowedYearlyKilometers,
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

exports.updateVehicleInformation = catchAsync(async (req, res, next) => {
    const updatedVehicle = await Vehicle.findById(req.params.id)

    updatedVehicle.mark = req.body.mark || updatedVehicle.mark
    updatedVehicle.model = req.body.model || updatedVehicle.model
    updatedVehicle.registrationNumber = req.body.registrationNumber || updatedVehicle.registrationNumber
    updatedVehicle.HSN = req.body.HSN || updatedVehicle.HSN
    updatedVehicle.TSN = req.body.TSN || updatedVehicle.TSN
    updatedVehicle.firstVehicleRegistration = req.body.firstVehicleRegistration || updatedVehicle.firstVehicleRegistration
    updatedVehicle.firstVehicleRegistrationOnOwner = req.body.firstVehicleRegistrationOnOwner || updatedVehicle.firstVehicleRegistrationOnOwner
    updatedVehicle.kilometersDriven = req.body.kilometersDriven || updatedVehicle.kilometersDriven
    updatedVehicle.lastTechnicalInspection = req.body.lastTechnicalInspection || updatedVehicle.lastTechnicalInspection
    updatedVehicle.nextTechnicalInspection = req.body.nextTechnicalInspection || updatedVehicle.nextTechnicalInspection
    updatedVehicle.TUV = req.body.TUV || updatedVehicle.TUV,
        updatedVehicle.TUVExpiresInOneMonth = req.body.TUV ? new Date(req.body.TUV) > new Date() && new Date(req.body.TUV) < new Date(new Date().setMonth(new Date().getMonth() + 1)) : updatedVehicle.TUVExpiresInOneMonth,
        updatedVehicle.TUVExpiresInFourteenDays = req.body.TUV ? new Date(req.body.TUV) > new Date() && new Date(req.body.TUV) < new Date(new Date().setDate(new Date().getDate() + 14)) : updatedVehicle.TUVExpiresInFourteenDays,
        updatedVehicle.AU = req.body.AU || updatedVehicle.AU
    updatedVehicle.monthlyInsurancePayment = req.body.monthlyInsurancePayment || updatedVehicle.monthlyInsurancePayment
    updatedVehicle.allowedYearlyKilometers = req.body.allowedYearlyKilometers || updatedVehicle.allowedYearlyKilometers
    updatedVehicle.yearlyTax = req.body.yearlyTax || updatedVehicle.yearlyTax

    await updatedVehicle.save({ validateBeforeSave: true })

    res.status(200).json({
        message: 'success',
        updatedVehicle
    })
})