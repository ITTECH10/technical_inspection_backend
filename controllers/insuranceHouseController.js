const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const Insurance = require('./../models/InsuranceHouseModel')

exports.createInsuranceHouse = catchAsync(async(req, res, next) => {
    const newInsuranceHouse = await Insurance.create({
        insuranceOwner: req.params.insuranceId,
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