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
        kasko: req.body.kasko
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
        return next(new AppError('There is no insurance in our DB to be updated', 404))
    }

    if (insurance._id.toString() !== req.params.insuranceId.toString()) {
        return next(new AppError('Route malformed, you do not have permissions to perform this action.', 400))
    }

    insurance.insuranceHouse = req.body.insuranceHouse || insurance.insuranceHouse
    insurance.contractNumber = req.body.contractNumber || insurance.contractNumber
    insurance.kasko = req.body.kasko || insurance.kasko

    await insurance.save({ validateBeforeSave: true })

    res.status(200).json({
        message: 'success',
        insurance
    })
})

exports.getAllInsurances = catchAsync(async (req, res, next) => {
    const insurances = await Insurance.find()

    if (!insurances) {
        return next(new AppError('There are no insurances found.', 404))
    }

    res.status(200).json({
        message: 'success',
        insurances
    })
})

exports.getUsersInsuranceHouse = catchAsync(async (req, res, next) => {
    const insurance = await Insurance.findById(req.params.insuranceId)

    if (!insurance) {
        return next(new AppError('There are no insurances found.', 404))
    }

    if (insurance._id.toString() !== req.params.insuranceId.toString()) {
        return next(new AppError('Route malformed, you do not have permissions to perform this action.', 400))
    }

    res.status(200).json({
        message: 'success',
        insurance
    })
})