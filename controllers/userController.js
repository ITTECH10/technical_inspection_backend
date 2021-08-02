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