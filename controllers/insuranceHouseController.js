const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const Insurance = require('./../models/InsuranceHouseModel')

exports.createInsuranceHouse = catchAsync(async(req, res, next) => {
    const newInsuranceHouse = await Insurance.create({
        name: req.body.name,
        streetAddress: req.body.street,
        numberAddress: req.body.number,
        postNumber: req.body.postNumber,
        city: req.body.city,
        phoneNumber: req.body.phoneNumber
    })

    res.status(201).json({
        message: 'success',
        newInsuranceHouse
    })
})

exports.getAllInsurances = catchAsync(async(req, res, next) => {
    const insurances = await Insurance.find()

    if(!insurances) {
        return next(new AppError('There are no insurances found.', 404))
    }

    res.status(200).json({
        message: 'success',
        insurances
    })
})

exports.getUsersInsuranceHouse = catchAsync(async(req, res, next) => {
    const insurance = await Insurance.findById(req.params.insuranceId)

    if(!insurance) {
        return next(new AppError('There are no insurances found.', 404))
    }

    res.status(200).json({
        message: 'success',
        insurance
    })
})