const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const User = require('./../models/UserModel')
const validator = require('validator')
const Vehicle = require('../models/VehicleModel')
const File = require('../models/FileModel')
const Insurance = require('../models/InsuranceHouseModel')
const UserEmailNotifications = require('./../utils/Emails/UserRelatedNotifications')
const CommonEmailNotifications = require('../utils/Emails/CommonRelatedNotifications')

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
        return next(new AppError('Benutzer konnte nicht gefunden werden.', 404))
    }

    res.status(200).json({
        message: 'success',
        user
    })
})

exports.getMyCredentials = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ _id: req.user._id })

    if (!user) {
        return next(new AppError('Beim Laden Ihrer Kontodaten ist ein Fehler aufgetreten.', 404))
    }

    res.status(200).json({
        message: 'success',
        user
    })
})

exports.editUserInfo = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    const changedValues = Object.keys(req.body).reduce((a, k) => (JSON.stringify(user[k]) !== JSON.stringify(req.body[k]) && (a[k] = req.body[k]), a), {})
    const formatedChangedValues = JSON.stringify(changedValues, null, '\t').replace("{", "").replace("}", "")

    if (!user) {
        return next(new AppError('Benutzer nicht gefunden.', 404))
    }

    if (req.body.role) {
        return next(new AppError('Sie sind nicht berechtigt, diese Aktion durchzuführen.', 403))
    }

    if (req.body.email) {
        if (!validator.isEmail(req.body.email)) {
            return next(new AppError('Bitte verwenden Sie ein korrektes E-Mail-Format.', 400))
        }
    }

    user.firstName = req.body.firstName || user.firstName
    user.lastName = req.body.lastName || user.lastName
    user.gender = req.body.gender || user.gender
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber
    user.smartphoneNumber = req.body.smartphoneNumber || user.smartphoneNumber
    user.street = req.body.street || user.street
    user.customerType = req.body.customerType || user.customerType
    user.postCode = req.body.postCode || user.postCode
    user.city = req.body.city || user.city
    user.email = req.body.email || user.email
    user.corespondencePartner = req.body.customerPartner || user.corespondencePartner
    user.corespondencePartnerEmail = req.body.customerPartnerEmail || user.corespondencePartnerEmail
    user.protectionLetter = req.body.protectionLetter
    user.ADAC = req.body.ADAC
    user.membershipNumber = req.body.membershipNumber

    await user.save({
        new: true,
        validateBeforeSave: false
    })

    try {
        // await new CommonEmailNotifications(req.user.role).customerInformationsUpdated(user, formatedChangedValues)
    } catch (err) {
        if (err) {
            console.log(err)
        }
    }

    res.status(202).json({
        message: 'success',
        user
    })
})

// FIX LATER
exports.deleteUser = catchAsync(async (req, res, next) => {
    const customer = await User.findByIdAndDelete(req.params.id)
    await Vehicle.deleteMany({ vehicleOwner: req.params.id })

    try {
        await new UserEmailNotifications().customerDeleted(customer)
    } catch (err) {
        if (err) {
            console.log(err)
        }
    }

    res.status(204).json({
        message: 'success'
    })
})

