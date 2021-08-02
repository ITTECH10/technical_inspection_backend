const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const User = require('./../models/UserModel')

exports.getAllUsers = catchAsync(async(req, res, next) => {
    const users = await User.find()

    res.status(200).json({
        message: 'success',
        users
    })
})

exports.getMyCredentials = catchAsync(async(req, res, next) => {
    const user = await User.findOne({_id: req.user._id})

    if(!user) {
        return next(new AppError('There was a problem loading your account data.', 404))
    }

    res.status(200).json({
        message: 'success',
        user
    })
})