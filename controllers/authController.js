const User = require('./../models/UserModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const createSendToken = require('./../utils/signToken')
const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const Email = require('./../utils/nodemailer')
const crypto = require('crypto')

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        birthDate: req.body.birthDate,
        role: req.body.role,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    })

    const url = 'https://technical-inspection-frontend.vercel.app/'

    try {
        await new Email(newUser).customerCreated(req.body.password, url)

        newUser.password = undefined
        newUser.__v = undefined
    }
    catch (err) {
        console.log(err)
    }

    res.status(201).json({
        message: 'success',
        newUser
    })
})

exports.login = catchAsync(async (req, res, next) => {
    const { password, email } = req.body

    if (!email || !password) {
        return next(new AppError('Please provide email and password.', 401))
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user || !await user.comparePasswords(password, user.password)) {
        return next(new AppError('Netačan e-mail ili lozinka.', 401))
    }

    createSendToken(user, 201, res)
})

exports.protect = catchAsync(async (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (req.cookies.jwt) {
        token = req.cookies.jwt
    }

    if (!token) {
        return next(new AppError('Invalid token', 401))
    }

    const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    const currentUser = await User.findById(decodedToken.id)

    if (!currentUser) {
        return next(new AppError('User belonging to this token does no longer exist.', 404))
    }

    req.user = currentUser
    next()
})

exports.acceptPrivacyPolicy = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.userId)

    if (!user) {
        return next(new AppError('User not found', 404))
    }

    user.policiesAccepted = true

    user.save({ validateBeforeSave: false })

    res.status(200).json({
        message: 'success',
        user
    })
})

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError('You do not have permission to perform this action', 403)
            );
        }

        next();
    };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return next(new AppError('Customer associated with this email does not exist.', 404))
    }

    const resetToken = user.createPasswordResetToken()
    // const resetURL = `${req.protocol}://${req.get('host')}/users/resetPassword/${resetToken}`;
    // FOR TESTING BELLOW
    const resetURL = `https://technical-inspection-frontend.vercel.app/resetPassword/${resetToken}`

    await user.save({ validateBeforeSave: false })

    try {
        await new Email(user).sendPasswordReset(resetURL);

        res.status(200).json({
            message: 'success'
        })

    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpiresIn = undefined;
        await user.save({ validateBeforeSave: false })

        return next(new AppError('There was an error sending the email. Please try again later.', 500))
    }
})

exports.resetPassword = catchAsync(async (req, res, next) => {
    const encryptedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    console.log(encryptedToken)

    const user = await User.findOne({
        passwordResetToken: encryptedToken,
        passwordResetTokenExpiresIn: { $gt: Date.now() }
    });

    if (!user) {
        return next(new AppError('Token is invalid or it is expired.', 400));
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresIn = undefined;

    await user.save();

    const token = signToken(user._id);

    res.status(200).json({
        message: 'success',
        token
    })
});