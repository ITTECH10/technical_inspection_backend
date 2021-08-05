const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const Vehicle = require('./../models/VehicleModel')

exports.createVehicle = catchAsync(async(req, res, next) => {
    const newVehicle = await Vehicle.create({
        vehicleOwner: req.params.id,
        model: req.body.model,
        modelDetails: req.body.modelDetails,
        lastTechnicalInspection: req.body.lastTechnicalInspection
    })

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