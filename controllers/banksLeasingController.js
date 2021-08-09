const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const BanksLeasing = require('./../models/BanksLeasingModel')

exports.createBanksLeasing = catchAsync(async(req, res, next) => {
    const newBanksLeasing = await BanksLeasing.create({
        banksLeasingOwner: req.params.bankLeasingId,
        name: req.body.name,
        streetAddress: req.body.street,
        numberAddress: req.body.number,
        postNumber: req.body.postNumber,
        city: req.body.city,
        phoneNumber: req.body.phoneNumber
    })

    res.status(201).json({
        message: 'success',
        newBanksLeasing
    })
})