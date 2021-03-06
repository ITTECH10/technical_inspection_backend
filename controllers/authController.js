const User = require('./../models/UserModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const createSendToken = require('./../utils/signToken')
const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const UserEmailNotifications = require('./../utils/Emails/UserRelatedNotifications')
const CommonEmailNotifications = require('../utils/Emails/CommonRelatedNotifications')
const AdminEmailNotifications = require('../utils/Emails/AdminRelatedNotifications')

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        corespondencePartner: req.body.customerPartner,
        customerType: req.body.customerType,
        companyName: req.body.companyName,
        corespondencePartnerEmail: req.body.customerPartnerEmail,
        phoneNumber: req.body.phoneNumber,
        gender: req.body.gender,
        smartphoneNumber: req.body.smartphoneNumber,
        street: req.body.street,
        postCode: req.body.postCode,
        city: req.body.city,
        role: req.body.role,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        loginCredentialsRecipient: req.body.loginCredentialsRecipient
    })

    try {
        await new CommonEmailNotifications().customerCreated(
            {
                ...newUser,
                loginCredentialsRecipient: req.body.loginCredentialsRecipient,
                email: req.body.email,
                password: req.body.password
            },
            req.body.password
        )

        newUser.password = undefined
        newUser.__v = undefined
    }
    catch (err) {
        console.log(err)
        return next(new AppError('Beim Senden der E-Mail ist etwas schief gelaufen!', 500))
    }

    res.status(201).json({
        message: 'success',
        newUser
    })
})

exports.login = catchAsync(async (req, res, next) => {
    const { password, email } = req.body

    if (!email || !password) {
        return next(new AppError('Bitte E-Mail und Passwort eingeben!', 401))
    }

    const user = await User.findOne({ email: email.trim() }).select('+password')
    if (!user || !await user.comparePasswords(password.trim(), user.password)) {
        return next(new AppError('Benutzername oder Passwort ung??ltig!', 401))
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
        return next(new AppError('Ung??ltiges Token! Bitte melden Sie sich erneut an oder kontaktieren Sie uns!', 401))
    }

    const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    const currentUser = await User.findById(decodedToken.id)

    if (!currentUser) {
        return next(new AppError('Der Benutzer mit diesem Token existiert nicht mehr.', 404))
    }

    req.user = currentUser
    next()
})

exports.acceptPrivacyPolicy = catchAsync(async (req, res, next) => {
    if (req.params.userId.toString() !== req.user._id.toString()) {
        return next(new AppError('Sie sind nicht berechtigt, diese Aktion durchzuf??hren.', 400))
    }

    const user = await User.findById(req.params.userId)

    if (!user) {
        return next(new AppError('Benutzer nicht gefunden!', 404))
    }

    user.policiesAccepted = true

    await user.save({ validateBeforeSave: false })

    res.status(200).json({
        message: 'success',
        user
    })
})

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError('Sie sind nicht berechtigt, diese Aktion durchzuf??hren.', 403)
            );
        }

        next();
    };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return next(new AppError('Der Kunde, der mit dieser E-Mail verbunden ist, existiert nicht.', 404))
    }

    const resetToken = user.createPasswordResetToken()
    // const resetURL = `${req.protocol}://localhost:3000/resetPassword/${resetToken}`;

    const resetURL = `https://app.se-carmanagement.de/resetPassword/${resetToken}`

    await user.save({ validateBeforeSave: false })

    try {
        await new CommonEmailNotifications().sendPasswordResetToken(user, resetURL)

        res.status(200).json({
            message: 'success'
        })

    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpiresIn = undefined;
        await user.save({ validateBeforeSave: false })

        return next(new AppError('Es ist ein Fehler beim Senden der E-Mail aufgetreten. Bitte versuchen Sie es sp??ter noch einmal.', 500))
    }
})

exports.resetPassword = catchAsync(async (req, res, next) => {
    const encryptedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: encryptedToken,
        passwordResetTokenExpiresIn: { $gt: Date.now() }
    });

    if (!user) {
        return next(new AppError('Das Reset-Token ist ung??ltig oder es ist abgelaufen.', 400));
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresIn = undefined;

    await user.save({ validateBeforeSave: false });

    try {
        await new AdminEmailNotifications().userResetedPassword(user)
    } catch (err) {
        if (err) {
            console.log(err)
        }
    }

    createSendToken(user, 200, res)
});

exports.changeGeneratedPassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id).select('+password')

    if (!user.firstLogIn) {
        return next(new AppError('Sie k??nnen erst nach der ersten Anmeldung ein neues Passwort festlegen.', 403))
    }

    if (!await user.comparePasswords(req.body.currentPassword.trim(), user.password)) {
        return next(new AppError('Ihr aktuelles Passwort ist falsch!', 400))
    }

    user.password = req.body.password.trim()
    user.confirmPassword = req.body.confirmPassword.trim()
    user.firstLogIn = false
    await user.save()

    createSendToken(user, 200, res)
})

exports.skipPasswordChange = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id).select('+password')

    user.password = user.password
    user.firstLogIn = false
    await user.save({ validateBeforeSave: false })

    createSendToken(user, 200, res)
})