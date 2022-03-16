const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const Insurance = require('./../models/InsuranceHouseModel')
const Vehicle = require('./../models/VehicleModel')

exports.createInsuranceHouse = catchAsync(async (req, res, next) => {
    const newInsuranceHouse = await Insurance.create({
        insuranceOwner: req.params.creator,
        insuranceConnectedVehicle: req.params.vehicle,
        insuranceHouse: req.body.insuranceHouse,
        contractNumber: req.body.contractNumber,
        fullKasko: req.body.vk,
        partKasko: req.body.tk
    })

    const vehicle = await Vehicle.findById(newInsuranceHouse.insuranceConnectedVehicle)
    vehicle.insuranceHouse = newInsuranceHouse._id
    await vehicle.save({ validateBeforeSave: false })

    res.status(201).json({
        message: 'success',
        newInsuranceHouse
    })
})

exports.updateInsuranceHouse = catchAsync(async (req, res, next) => {
    const insurance = await Insurance.findById(req.params.insuranceId)

    if (!insurance) {
        return next(new AppError('Es gibt keine zu aktualisierende Versicherung in unserer Datenbank!', 404))
    }

    if (insurance._id.toString() !== req.params.insuranceId.toString()) {
        return next(new AppError('Sie sind nicht berechtigt, diese Aktion durchzuführen.', 400))
    }

    insurance.insuranceHouse = req.body.insuranceHouse || insurance.insuranceHouse
    insurance.contractNumber = req.body.contractNumber || insurance.contractNumber
    insurance.fullKasko = req.body.vk || insurance.fullKasko
    insurance.partKasko = req.body.tk || insurance.partKasko

    await insurance.save({ validateBeforeSave: true })

    res.status(200).json({
        message: 'success',
        insurance
    })
})

exports.getAllInsurances = catchAsync(async (req, res, next) => {
    const insurances = await Insurance.find()

    if (!insurances) {
        return next(new AppError('Es wurden keine Versicherung gefunden.', 404))
    }

    res.status(200).json({
        message: 'success',
        insurances
    })
})

exports.getUsersInsuranceHouse = catchAsync(async (req, res, next) => {
    const insurance = await Insurance.findById(req.params.insuranceId)

    if (!insurance) {
        return next(new AppError('Es wurden keine Versicherung gefunden.', 404))
    }

    if (insurance._id.toString() !== req.params.insuranceId.toString()) {
        return next(new AppError('Sie sind nicht berechtigt, diese Aktion durchzuführen.', 400))
    }

    res.status(200).json({
        message: 'success',
        insurance
    })
})