const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const Vehicle = require('./../models/VehicleModel')
const cloudinary = require('cloudinary').v2
const { uploadSingleFile } = require('./../utils/cloudinary')
const Email = require('./../utils/nodemailer')
const File = require('./../models/FileModel')
const User = require('./../models/UserModel')
const DateGenerator = require('./../utils/DateGenerator')

// MIDLEWARE FOR IMAGES
exports.checkForFiles = catchAsync(async (req, res, next) => {
    // if(!req.files) next()
    if (req.files) {
        uploadSingleFile(req)

        await cloudinary.uploader.upload(req.files.joinedTemp, (err, file) => {
            if (file) {
                // console.log(img)
                req.files.file = file.secure_url
                req.files.format = file.format
                req.files.fileName = req.files.photo.name
            }
            if (err) {
                // console.log(err)
            }
        })
    }

    next()
})

exports.createVehicle = catchAsync(async (req, res, next) => {
    const newVehicle = await Vehicle.create({
        vehicleOwner: req.params.id,
        model: req.body.model,
        thumbnail: req.files ? req.files.file : req.body.image,
        chassisNumber: req.body.chassisNumber,
        mark: req.body.mark,
        HSN: req.body.HSN,
        TSN: req.body.TSN,
        varantyExpiresAt: req.body.varantyExpiresAt,
        TUV: req.body.TUV,
        AU: req.body.AU,
        TUVExpiresInOneMonth: new DateGenerator(req.body.TUV).expiresInGivenMonths(1),
        TUVExpiresInFourteenDays: new DateGenerator(req.body.TUV).expiresInGivenDays(14),
        TUVExpiresInTwoMonths: new DateGenerator(req.body.TUV).expiresInGivenMonths(2),
        technicalInspectionInNextTwoMonths: new DateGenerator(req.body.nextTechnicalInspection).expiresInGivenMonths(2),
        AUExpiresInTwoMonths: new DateGenerator(req.body.AU).expiresInGivenMonths(2),
        firstVehicleRegistration: req.body.firstVehicleRegistration,
        firstVehicleRegistrationOnOwner: req.body.firstVehicleRegistrationOnOwner,
        lastTechnicalInspection: req.body.lastTechnicalInspection,
        nextTechnicalInspection: req.body.nextTechnicalInspection,
        kilometersDriven: req.body.kilometersDriven,
        registrationNumber: req.body.registrationNumber,
        monthlyInsurancePayment: req.body.monthlyInsurancePayment,
        allowedYearlyKilometers: req.body.allowedYearlyKilometers,
        yearlyTax: req.body.yearlyTax
    })

    const customer = await User.findById(req.params.id)

    if (req.files) {
        await File.create({
            uploadedFor: newVehicle._id,
            documentPublisher: req.user.role,
            url: req.files ? req.files.file : req.body.image,
            format: req.files ? req.files.format : req.body.format,
            name: req.files ? req.files.fileName : req.body.fileName,
            category: "DOCUMENT_TYPE_FAHRZEUGSCHEIN"
        })
    }

    try {
        await new Email(req.user, customer).carOperations("hinzugefügt", newVehicle)
    }
    catch (err) {
        console.log(err)
    }

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
    if (req.params.id.toString() !== req.user._id.toString()) {
        return next(new AppError('Route malformed, you do not have permissions to perform this action.', 400))
    }

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
    const car = await Vehicle.findById(req.params.carId)

    if (req.files) {
        uploadSingleFile(req)
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
        documentPublisher: req.user.role,
        url: req.files ? req.files.file : req.body.image,
        format: req.files ? req.files.format : req.body.format,
        name: req.body.photoName || req.files.fileName,
        category: req.body.fileCategory
    })

    const customer = await User.findById(car.vehicleOwner)

    try {
        await new Email(req.user, customer).documentOperations("added", car)
    }
    catch (err) {
        if (err) {
            console.log(err)
        }
    }

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
    const vehicleToDelete = await Vehicle.findByIdAndDelete(req.params.id)
    const userEmailRecipient = await User.findById(vehicleToDelete.vehicleOwner)

    try {
        await new Email(userEmailRecipient, true, true).carOperations("gelöscht", vehicleToDelete)
    } catch (err) {
        if (err) {
            console.log(err)
        }
    }

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
    const fileToDelete = await File.findByIdAndDelete(req.params.fileId)
    const car = await Vehicle.findById(fileToDelete.uploadedFor)
    const customer = await User.findById(car.vehicleOwner)

    // LATER THIS BELOOW // IMPORTANT
    // await cloudinary.v2.uploader.destroy('sample', function(error,result) {
    //     console.log(result, error) });

    try {
        await new Email(req.user, customer).documentOperations("deleted", car)
    } catch (err) {
        if (err) {
            console.log(err)
        }
    }

    res.status(204).json({
        message: 'success'
    })
})

exports.updateVehicleInformation = catchAsync(async (req, res, next) => {
    const updatedVehicle = await Vehicle.findById(req.params.id)
    const user = await User.findById(updatedVehicle.vehicleOwner)

    const changedValues = Object.keys(req.body).reduce((a, k) => (JSON.stringify(updatedVehicle[k]) !== JSON.stringify(req.body[k]) && (a[k] = req.body[k]), a), {})
    const formatedChangedValues = JSON.stringify(changedValues).replace("{", "").replace("}", "")

    updatedVehicle.chassisNumber = req.body.chassisNumber || updatedVehicle.chassisNumber
    updatedVehicle.mark = req.body.mark || updatedVehicle.mark
    updatedVehicle.model = req.body.model || updatedVehicle.model
    updatedVehicle.registrationNumber = req.body.registrationNumber || updatedVehicle.registrationNumber
    updatedVehicle.HSN = req.body.HSN || updatedVehicle.HSN
    updatedVehicle.TSN = req.body.TSN || updatedVehicle.TSN
    updatedVehicle.varantyExpiresAt = req.body.varantyExpiresAt || updatedVehicle.varantyExpiresAt
    updatedVehicle.insuranceHouse = req.body.insuranceHouse || updatedVehicle.insuranceHouse
    updatedVehicle.firstVehicleRegistration = req.body.firstVehicleRegistration || updatedVehicle.firstVehicleRegistration
    updatedVehicle.firstVehicleRegistrationOnOwner = req.body.firstVehicleRegistrationOnOwner || updatedVehicle.firstVehicleRegistrationOnOwner
    updatedVehicle.kilometersDriven = req.body.kilometersDriven || updatedVehicle.kilometersDriven
    updatedVehicle.lastTechnicalInspection = req.body.lastTechnicalInspection || updatedVehicle.lastTechnicalInspection
    updatedVehicle.nextTechnicalInspection = req.body.nextTechnicalInspection || updatedVehicle.nextTechnicalInspection
    updatedVehicle.carIsSold = req.body.carIsSold || updatedVehicle.carIsSold
    updatedVehicle.carIsSoldTo = req.body.carIsSoldTo || updatedVehicle.carIsSoldTo
    updatedVehicle.carIsSoldDate = req.body.carIsSoldDate || updatedVehicle.carIsSoldDate
    updatedVehicle.technicalInspectionInNextTwoMonths = req.body.nextTechnicalInspection ? new DateGenerator(req.body.nextTechnicalInspection).expiresInGivenMonths(2) : updatedVehicle.nextTechnicalInspection,
        updatedVehicle.allowedYearlyKilometers = req.body.allowedYearlyKilometers || updatedVehicle.allowedYearlyKilometers
    updatedVehicle.monthlyInsurancePayment = req.body.monthlyInsurancePayment || updatedVehicle.monthlyInsurancePayment
    updatedVehicle.yearlyTax = req.body.yearlyTax || updatedVehicle.yearlyTax
    updatedVehicle.TUV = req.body.TUV || updatedVehicle.TUV,
        updatedVehicle.AU = req.body.AU || updatedVehicle.AU
    updatedVehicle.TUVExpiresInOneMonth = req.body.TUV ? new DateGenerator(req.body.TUV).expiresInGivenMonths(1) : updatedVehicle.TUVExpiresInOneMonth,
        updatedVehicle.TUVExpiresInFourteenDays = req.body.TUV ? new DateGenerator(req.body.TUV).expiresInGivenDays(14) : updatedVehicle.TUVExpiresInFourteenDays,
        updatedVehicle.AUExpiresInTwoMonths = req.body.AU ? new DateGenerator(req.body.AU).expiresInGivenMonths(2) : updatedVehicle.AUExpiresInTwoMonths,
        updatedVehicle.TUVExpiresInTwoMonths = req.body.TUV ? new DateGenerator(req.body.TUV).expiresInGivenMonths(2) : updatedVehicle.TUVExpiresInTwoMonths,

        await updatedVehicle.save({ validateBeforeSave: true })

    try {
        await new Email(req.user, user).carOperations("aktualisiert", updatedVehicle, formatedChangedValues)
    } catch (err) {
        if (err) {
            console.log(err)
        }
    }

    res.status(200).json({
        message: 'success',
        updatedVehicle
    })
})