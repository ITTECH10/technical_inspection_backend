const User = require('./../models/UserModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const signToken = require('./../utils/signToken')
const {promisify} = require('util')
const jwt = require('jsonwebtoken')

exports.signup = catchAsync(async(req, res, next) => {
    const newUser = await User.create({
        email: req.body.email,
        vehicleModel: req.body.vehicleModel,
        lastInspected: req.body.lastInspected,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    })

    const token = signToken(newUser._id)

    res.status(201).json({
        message: 'success',
        token
    })
})

exports.login = catchAsync(async(req, res, next) => {
    const {email, password} = req.body

    if(!email || !password) {
        return next(new AppError('Please provide email and password.', 401))
    }

    const user = await User.findOne({email}).select('+password')

    if(!user || !await user.comparePasswords(password, user.password)) {
        return next(new AppError('Netačan e-mail ili lozinka.', 401))
    }

    const token = signToken(user._id)

    res.status(201).json({
        message: 'success',
        token
    })
})

exports.protect = catchAsync(async(req, res, next) => {
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    if(!token) {
        return next(new AppError('Invalid token', 401))
    }

    const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    const currentUser = await User.findById(decodedToken.id)

    if(!currentUser) {
        return next(new AppError('User belonging to this token does no longer exist.', 404))
    }

    req.user = currentUser
    next()
})