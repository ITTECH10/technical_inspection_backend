const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const Vehicle = require('./../models/VehicleModel')
const cloudinary = require('cloudinary').v2
const { uploadSingleFile } = require('./../utils/cloudinary')
const File = require('./../models/FileModel')
const User = require('./../models/UserModel')
const CashPayment = require('./../models/CashPaymentModel')
const CreditPayment = require('./../models/CreditPaymentModel')
const LeasingPayment = require('./../models/LeasingPaymentModel')
const Insurance = require('./../models/InsuranceHouseModel')
const DateGenerator = require('./../utils/DateGenerator')
const AdminEmailNotifications = require('./../utils/Emails/AdminRelatedNotifications')
const UserEmailNotifications = require('./../utils/Emails/UserRelatedNotifications')
const CommonEmailNotifications = require('./../utils/Emails/CommonRelatedNotifications')

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
        lastUUV: req.body.lastUUV,
        nextUUV: req.body.nextUUV,
        TUV: req.body.TUV,
        AU: req.body.AU,
        TUVExpiresInOneMonth: new DateGenerator(req.body.TUV).expiresInGivenMonths(1),
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
        await new CommonEmailNotifications(req.user.role).carOperations('hinzugefügt', newVehicle, customer)
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
    const vehicles = await Vehicle.find({ carIsSold: { $ne: true } }).sort({ 'TUVExpiresInTwoMonths': - 1 })

    if (!vehicles) {
        return next(new AppError('Keine Fahrzeuge gefunden.', 404))
    }

    res.status(200).json({
        message: 'success',
        vehicles
    })
})

exports.getMyVehicles = catchAsync(async (req, res, next) => {
    if (req.params.id.toString() !== req.user._id.toString()) {
        return next(new AppError('Sie sind nicht berechtigt, diese Aktion durchzuführen.', 400))
    }

    const userVehicles = await Vehicle.find({ vehicleOwner: req.params.id, carIsSold: { $ne: true } })

    if (!userVehicles) {
        return next(new AppError('Keine Fahrzeuge gefunden.', 404))
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

    const customer = await User.findById(car.vehicleOwner._id)

    try {
        await new CommonEmailNotifications(req.user.role).documentOperations(customer, 'hinzugefügt', car)
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
        return next(new AppError('Keine Bilder für dieses Auto gefunden.', 404))
    }

    res.status(200).json({
        message: 'success',
        images
    })
})

exports.deleteMyVehicles = catchAsync(async (req, res, next) => {
    const vehicleToDelete = await Vehicle.findByIdAndDelete(req.params.id)
    const customer = await User.findById(vehicleToDelete.vehicleOwner._id)

    const associatedFiles = await File.find({ uploadedFor: vehicleToDelete._id })

    const publicIds = associatedFiles.map(associatedFile => {
        return associatedFile.url.split('/')[7].split('.')[0]
    })

    try {
        await new UserEmailNotifications().vehicleDeleted(customer, vehicleToDelete)
        await File.deleteMany({ uploadedFor: vehicleToDelete._id })
        await CashPayment.deleteMany({ vehiclePayedFor: vehicleToDelete._id })
        await CreditPayment.deleteMany({ vehiclePayedFor: vehicleToDelete._id })
        await LeasingPayment.deleteMany({ vehiclePayedFor: vehicleToDelete._id })
        await Insurance.deleteMany({ insuranceConnectedVehicle: vehicleToDelete._id })

        // DELETE ALL IMAGES ASSOCIATED WITH VEHICLE FROM CLOUDINARY
        if (publicIds.length > 0) {
            await cloudinary.api.delete_resources(publicIds, { invalidate: true },
                function (error, result) {
                    if (error) {
                        console.log(error)
                    }
                });
        }
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
        return next(new AppError('Keine Fahrzeuge gefunden.', 404))
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
        return next(new AppError('Keine Fahrzeug gefunden.', 404))
    }

    res.status(200).json({
        message: 'success',
        vehicle
    })
})

exports.deleteVehicleFiles = catchAsync(async (req, res, next) => {
    const fileToDelete = await File.findByIdAndDelete(req.params.fileId)
    const car = await Vehicle.findById(fileToDelete.uploadedFor)
    const customer = await User.findById(car.vehicleOwner._id)

    const cloudinaryPublicId = fileToDelete.url.split('/')[7].split('.')[0]

    try {
        if (cloudinaryPublicId) {
            await cloudinary.uploader.destroy(cloudinaryPublicId, { invalidate: true }, function (error, result) {
                if (error) {
                    console.log(error)
                }
            });
        }
    } catch (err) {
        console.log(err)
    }

    try {
        await new CommonEmailNotifications(req.user.role).documentOperations(customer, 'gelöscht', car)
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
    const formatedChangedValues = JSON.stringify(changedValues, null, '\t').replace("{", "").replace("}", "")

    if (req.body.nextTechnicalInspection && new Date(req.body.nextTechnicalInspection).getTime() !== new Date(updatedVehicle.nextTechnicalInspection).getTime()) {
        updatedVehicle.ntiServiceExpiresInOneMonthEmailNotifier = undefined
    }

    if (req.body.TUV && new Date(req.body.TUV).getTime() !== new Date(updatedVehicle.TUV).getTime()) {
        updatedVehicle.TuvExpiresInNextMonthNotifier = undefined
        updatedVehicle.TuvExpiresInNextTwoMonthsNotifier = undefined
    }

    if (req.body.AU && new Date(req.body.AU).getTime() !== new Date(updatedVehicle.AU).getTime()) {
        updatedVehicle.AuExpiresInNextMonthNotifier = undefined
        updatedVehicle.AuExpiresInNextTwoMonthsNotifier = undefined
    }

    updatedVehicle.chassisNumber = req.body.chassisNumber || updatedVehicle.chassisNumber
    updatedVehicle.mark = req.body.mark || updatedVehicle.mark
    updatedVehicle.model = req.body.model || updatedVehicle.model
    updatedVehicle.registrationNumber = req.body.registrationNumber || updatedVehicle.registrationNumber
    updatedVehicle.HSN = req.body.HSN || updatedVehicle.HSN
    updatedVehicle.TSN = req.body.TSN || updatedVehicle.TSN
    updatedVehicle.lastUUV = req.body.lastUUV || updatedVehicle.lastUUV
    updatedVehicle.nextUUV = req.body.nextUUV || updatedVehicle.nextUUV
    updatedVehicle.varantyExpiresAt = req.body.varantyExpiresAt || updatedVehicle.varantyExpiresAt
    updatedVehicle.insuranceHouse = req.body.insuranceHouse || updatedVehicle.insuranceHouse
    updatedVehicle.firstVehicleRegistration = req.body.firstVehicleRegistration || updatedVehicle.firstVehicleRegistration
    updatedVehicle.firstVehicleRegistrationOnOwner = req.body.firstVehicleRegistrationOnOwner || updatedVehicle.firstVehicleRegistrationOnOwner
    updatedVehicle.kilometersDriven = req.body.kilometersDriven || updatedVehicle.kilometersDriven
    updatedVehicle.lastTechnicalInspection = req.body.lastTechnicalInspection || updatedVehicle.lastTechnicalInspection
    updatedVehicle.nextTechnicalInspection = req.body.nextTechnicalInspection || updatedVehicle.nextTechnicalInspection
    updatedVehicle.technicalInspectionInNextTwoMonths = new DateGenerator(req.body.nextTechnicalInspection).expiresInGivenMonths(2) || new DateGenerator(updatedVehicle.nextTechnicalInspection).expiresInGivenMonths(2),
        updatedVehicle.carIsSold = req.body.carIsSold || updatedVehicle.carIsSold
    updatedVehicle.carIsSoldTo = req.body.carIsSoldTo || updatedVehicle.carIsSoldTo
    updatedVehicle.carIsSoldDate = req.body.carIsSoldDate || updatedVehicle.carIsSoldDate
    updatedVehicle.technicalInspectionInNextTwoMonths = req.body.nextTechnicalInspection ? new DateGenerator(req.body.nextTechnicalInspection).expiresInGivenMonths(2) : updatedVehicle.technicalInspectionInNextTwoMonths,
        updatedVehicle.allowedYearlyKilometers = req.body.allowedYearlyKilometers || updatedVehicle.allowedYearlyKilometers
    updatedVehicle.monthlyInsurancePayment = req.body.monthlyInsurancePayment || updatedVehicle.monthlyInsurancePayment
    updatedVehicle.yearlyTax = req.body.yearlyTax || updatedVehicle.yearlyTax
    updatedVehicle.TUV = req.body.TUV || updatedVehicle.TUV,
        updatedVehicle.AU = req.body.AU || updatedVehicle.AU
    updatedVehicle.TUVExpiresInOneMonth = req.body.TUV ? new DateGenerator(req.body.TUV).expiresInGivenMonths(1) : updatedVehicle.TUVExpiresInOneMonth,
        updatedVehicle.AUExpiresInTwoMonths = req.body.AU ? new DateGenerator(req.body.AU).expiresInGivenMonths(2) : updatedVehicle.AUExpiresInTwoMonths,
        updatedVehicle.TUVExpiresInTwoMonths = req.body.TUV ? new DateGenerator(req.body.TUV).expiresInGivenMonths(2) : updatedVehicle.TUVExpiresInTwoMonths

    await updatedVehicle.save({ validateBeforeSave: true })

    try {
        await new CommonEmailNotifications(req.user.role).carOperations("aktualisiert", updatedVehicle, user, formatedChangedValues)
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

exports.markVehicleForSelling = catchAsync(async (req, res, next) => {
    const pickedVehicle = await Vehicle.findById(req.params.id)

    if (!pickedVehicle) {
        return next(new AppError('Gewähltes Fahrzeug nicht gefunden.', 404))
    }

    if (pickedVehicle._id.toString() !== req.params.id.toString()) {
        return next(new AppError('Sie sind nicht berechtigt, diese Aktion durchzuführen.', 400))
    }

    pickedVehicle.markForSelling = true
    await pickedVehicle.save({ validateBeforeSave: false })

    res.status(200).json({
        message: 'success',
        pickedVehicle
    })
})

exports.unmarkVehicleForSelling = catchAsync(async (req, res, next) => {
    const pickedVehicle = await Vehicle.findById(req.params.id)

    if (!pickedVehicle) {
        return next(new AppError('Gewähltes Fahrzeug nicht gefunden.', 404))
    }

    if (pickedVehicle._id.toString() !== req.params.id.toString()) {
        return next(new AppError('Sie sind nicht berechtigt, diese Aktion durchzuführen.', 400))
    }

    try {
        pickedVehicle.markForSelling = undefined

        if (pickedVehicle.adminNotifiedAboutCarSelling) {
            await new AdminEmailNotifications().abortVehicleSellingToAdmin(pickedVehicle)
            pickedVehicle.adminNotifiedAboutCarSelling = undefined
            await pickedVehicle.save({ validateBeforeSave: false })
        }

    } catch (err) {
        pickedVehicle.markForSelling = true
        pickedVehicle.adminNotifiedAboutCarSelling = undefined
        await pickedVehicle.save({ validateBeforeSave: false })
    }

    res.status(200).json({
        message: 'success',
        pickedVehicle
    })
})

exports.recommendVehicleToAdmin = catchAsync(async (req, res, next) => {
    const pickedVehicle = await Vehicle.findById(req.params.id)

    if (!pickedVehicle) {
        return next(new AppError('Gewähltes Fahrzeug nicht gefunden.', 404))
    }

    if (pickedVehicle._id.toString() !== req.params.id.toString()) {
        return next(new AppError('Sie sind nicht berechtigt, diese Aktion durchzuführen.', 400))
    }

    // SEND EMAIL
    try {
        await new AdminEmailNotifications().sellVehicleToAdmin(pickedVehicle)
        pickedVehicle.adminNotifiedAboutCarSelling = true
        await pickedVehicle.save({ validateBeforeSave: false })
    } catch (err) {
        pickedVehicle.adminNotifiedAboutCarSelling = undefined
        await pickedVehicle.save({ validateBeforeSave: false })
        console.log(err)
    }

    res.status(200).json({
        message: 'success',
        pickedVehicle
    })
})

exports.reportVehicleDamage = catchAsync(async (req, res, next) => {
    const damagedVehicle = await Vehicle.findById(req.params.id)
    const { damageDescription } = req.body

    if (!damagedVehicle) {
        return next(new AppError('Das von Ihnen ausgewählte Fahrzeug existiert nicht.', 404))
    }

    if (damagedVehicle._id.toString() !== req.params.id.toString()) {
        return next(new AppError('Sie sind nicht berechtigt, diese Aktion durchzuführen.', 400))
    }

    // SEND EMAIL
    try {
        await new AdminEmailNotifications().reportVehicleDamage(damagedVehicle, damageDescription)
    } catch (err) {
        console.log(err)
    }

    res.status(201).json({
        message: 'success'
    })
})