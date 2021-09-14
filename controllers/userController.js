const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const User = require('./../models/UserModel')
const validator = require('validator')
const Vehicle = require('../models/VehicleModel')

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find().select('-__v')

    res.status(200).json({
        message: 'success',
        users
    })
})

exports.getOneUser = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ _id: req.params.id })

    if (!user) {
        return next(new AppError('User could not be found', 404))
    }

    res.status(200).json({
        message: 'success',
        user
    })
})

exports.getMyCredentials = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ _id: req.user._id })

    if (!user) {
        return next(new AppError('There was a problem loading your account data.', 404))
    }

    res.status(200).json({
        message: 'success',
        user
    })
})

exports.editUserInfo = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if (!user) {
        return next(new AppError('Editing user went wrong', 404))
    }

    if (req.body.role) {
        return next(new AppError('You do not have permission to perform this action.', 403))
    }

    if (req.body.email) {
        if (!validator.isEmail(req.body.email)) {
            return next(new AppError('Please use a correct email format.', 400))
        }
    }

    user.firstName = req.body.firstName || user.firstName
    user.lastName = req.body.lastName || user.lastName
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber
    user.street = req.body.street || user.street
    user.postCode = req.body.postCode || user.postCode
    user.city = req.body.city || user.city
    user.birthDate = req.body.birthDate || user.birthDate
    user.email = req.body.email || user.email

    await user.save({
        new: true,
        validateBeforeSave: false
    })

    res.status(202).json({
        message: 'success',
        user
    })
})

// FIX LATER
exports.deleteUser = catchAsync(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id)
    await Vehicle.deleteMany({ vehicleOwner: req.params.id })

    res.status(204).json({
        message: 'success'
    })
})
