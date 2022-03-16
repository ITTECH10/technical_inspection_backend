const AppError = require('./../utils/appError')
const catchAsync = require('./../utils/catchAsync')
const CashPayment = require('./../models/CashPaymentModel')
const CreditPayment = require('./../models/CreditPaymentModel')
const LeasingPayment = require('./../models/LeasingPaymentModel')
const Vehicle = require('./../models/VehicleModel')
const User = require('./../models/UserModel')
const UserEmailNotifications = require('../utils/Emails/UserRelatedNotifications')

exports.createCashPayment = catchAsync(async (req, res, next) => {
    const newCashPayment = await CashPayment.create({
        vehiclePayedFor: req.params.carId,
        payedAt: req.body.payedAt,
        cashSum: req.body.cashSum,
        boughtFrom: req.body.boughtFrom,
        kilometersDrivenWhenPurchased: req.body.kilometersDrivenWhenPurchased
    })

    const vehicle = await Vehicle.findById(req.params.carId)
    const customer = await User.findById(vehicle.vehicleOwner._id)

    if (vehicle._id.toString() !== req.params.carId.toString()) {
        return next(new AppError('Sie sind nicht berechtigt, diese Aktion durchzuführen.', 400))
    }

    vehicle.vehiclePaymentType = newCashPayment._id
    vehicle.vehiclePaymentTypeVariant = 'cash'
    await vehicle.save({ validateBeforeSave: false })

    try {
        await new UserEmailNotifications().paymentOperations(customer, 'hinzugefügt', 'cash', vehicle)
    } catch (err) {
        if (err) {
            console.log(err)
        }
    }

    res.status(201).json({
        message: 'success',
        newCashPayment,
        vehicle
    })
})

exports.createCreditPayment = catchAsync(async (req, res, next) => {
    const newCreditPayment = await CreditPayment.create({
        vehiclePayedFor: req.params.carId,
        creditInstitute: req.body.creditInstitute,
        contractNumber: req.body.contractNumber,
        boughtFrom: req.body.boughtFrom,
        creditStartDate: req.body.creditStartDate,
        monthlyCreditPayment: req.body.monthlyCreditPayment,
        interestRate: req.body.interestRate,
        creditLastsFor: req.body.creditLastsFor,
        closingRate: req.body.closingRate,
        kilometersDrivenWhenPurchased: req.body.kilometersDrivenWhenPurchased
    })

    const expirationDate = new Date(new Date().setMonth(new Date().getMonth() + newCreditPayment.creditLastsFor))

    const vehicle = await Vehicle.findById(req.params.carId)
    const customer = await User.findById(vehicle.vehicleOwner._id)

    vehicle.vehiclePaymentType = newCreditPayment._id
    vehicle.contractExpiresOn = newCreditPayment.creditLastsFor
    vehicle.contractExpirationDate = new Date(new Date().setMonth(new Date().getMonth() + newCreditPayment.creditLastsFor))
    vehicle.contractExpiresInNextTwoMonths = expirationDate > new Date() && expirationDate < new Date(new Date().setMonth(new Date().getMonth() + 8))
    vehicle.vehiclePaymentTypeVariant = 'credit'
    await vehicle.save({ validateBeforeSave: false })

    try {
        await new UserEmailNotifications().paymentOperations(customer, 'hinzugefügt', 'credit', vehicle)
    } catch (err) {
        if (err) {
            console.log(err)
        }
    }

    res.status(201).json({
        message: 'success',
        newCreditPayment,
        vehicle
    })
})

exports.createLeasingPayment = catchAsync(async (req, res, next) => {
    const newLeasingPayment = await LeasingPayment.create({
        vehiclePayedFor: req.params.carId,
        leasingGiver: req.body.leasingGiver,
        contractNumber: req.body.contractNumber,
        boughtFrom: req.body.boughtFrom,
        maintenancePackage: req.body.maintenancePackage,
        leasingStartDate: req.body.leasingStartDate,
        monthlyLeasingPayment: req.body.monthlyLeasingPayment,
        leasingLastsFor: req.body.leasingLastsFor,
        remainingPayment: req.body.remainingPayment,
        allowedYearlyKilometers: req.body.allowedYearlyKilometers,
        costsForMoreKilometers: req.body.costsForMoreKilometers,
        costsForLessKilometers: req.body.costsForLessKilometers,
        moreDetails: req.body.moreDetails,
        kilometersDrivenWhenPurchased: req.body.kilometersDrivenWhenPurchased
    })

    const expirationDate = new Date(new Date().setMonth(new Date().getMonth() + newLeasingPayment.leasingLastsFor))

    const vehicle = await Vehicle.findById(req.params.carId)
    const customer = await User.findById(vehicle.vehicleOwner)

    vehicle.vehiclePaymentType = newLeasingPayment._id
    vehicle.contractExpiresOn = newLeasingPayment.leasingLastsFor
    vehicle.contractExpirationDate = expirationDate
    vehicle.contractExpiresInNextTwoMonths = expirationDate > new Date() && expirationDate < new Date(new Date().setMonth(new Date().getMonth() + 8))
    vehicle.vehiclePaymentTypeVariant = 'leasing'
    await vehicle.save({ validateBeforeSave: false })

    try {
        await new UserEmailNotifications().paymentOperations(customer, 'hinzugefügt', 'leasing', vehicle)
    } catch (err) {
        if (err) {
            console.log(err)
        }
    }

    res.status(201).json({
        message: 'success',
        newLeasingPayment,
        vehicle
    })
})

exports.getCorespondingPayment = catchAsync(async (req, res, next) => {
    const cashPayment = await CashPayment.findById(req.params.paymentId)
    const creditPayment = await CreditPayment.findById(req.params.paymentId)
    const leasingPayment = await LeasingPayment.findById(req.params.paymentId)

    // !!FINISH LATER
    // if (cashPayment && cashPayment._id.toString() !== req.params.paymentId.toString()) {
    //     return next(new AppError('Die Route ist fehlerhaft, Sie haben keine Berechtigung, diese Aktion durchzuführen.', 400))
    // }

    // if (creditPayment._id.toString() !== req.params.paymentId.toString()) {
    //     return next(new AppError('Die Route ist fehlerhaft, Sie haben keine Berechtigung, diese Aktion durchzuführen.', 400))
    // }

    // if (leasingPayment && leasingPayment._id.toString() !== req.params.paymentId.toString()) {
    //     return next(new AppError('Die Route ist fehlerhaft, Sie haben keine Berechtigung, diese Aktion durchzuführen.', 400))
    // }

    res.status(200).json({
        message: 'success',
        payments: {
            cashPayment,
            creditPayment,
            leasingPayment
        }
    })
})

exports.updateCashPayment = catchAsync(async (req, res, next) => {
    const cashPayment = await CashPayment.findById(req.params.paymentId)
    const vehicle = await Vehicle.findById(req.body.vehiclePayedFor)

    const changedValues = Object.keys(req.body).reduce((a, k) => (JSON.stringify(cashPayment[k]) !== JSON.stringify(req.body[k]) && (a[k] = req.body[k]), a), {})
    const formatedChangedValues = JSON.stringify(changedValues, null, '\t').replace("{", "").replace("}", "")

    const customer = await User.findById(vehicle.vehicleOwner._id)

    if (vehicle._id.toString() === cashPayment.vehiclePayedFor.toString()) {
        cashPayment.vehiclePayedFor = req.body.vehiclePayedFor || cashPayment.vehiclePayedFor
        cashPayment.payedAt = req.body.payedAt || cashPayment.payedAt
        cashPayment.cashSum = req.body.cashSum || cashPayment.cashSum
        cashPayment.boughtFrom = req.body.boughtFrom || cashPayment.boughtFrom
        cashPayment.kilometersDrivenWhenPurchased = req.body.kilometersDrivenWhenPurchased || cashPayment.kilometersDrivenWhenPurchased

        vehicle.vehiclePaymentTypeVariant = 'cash'

        await cashPayment.save({ validateBeforeSave: false })
        await vehicle.save({ validateBeforeSave: false })
    } else {
        return next(new AppError('Route malformed, you do not have permissions to perform this action.', 400))
    }

    try {
        await new UserEmailNotifications().paymentOperations(customer, 'aktualisiert', 'cash', vehicle, formatedChangedValues)
    } catch (err) {
        if (err) {
            console.log(err)
        }
    }

    res.status(202).json({
        message: 'success',
        cashPayment
    })
})

exports.updateCreditPayment = catchAsync(async (req, res, next) => {
    const creditPayment = await CreditPayment.findById(req.params.paymentId)
    const vehicle = await Vehicle.findById(req.body.vehiclePayedFor)

    if (req.body.creditLastsFor && +req.body.creditLastsFor !== +creditPayment.creditLastsFor) {
        vehicle.creditExpiresInUpcomingThreeMonthsNotifier = undefined
        vehicle.creditExpiresInUpcomingSixMonthsNotifier = undefined
    }

    const changedValues = Object.keys(req.body).reduce((a, k) => (JSON.stringify(creditPayment[k]) !== JSON.stringify(req.body[k]) && (a[k] = req.body[k]), a), {})
    const formatedChangedValues = JSON.stringify(changedValues, null, '\t').replace("{", "").replace("}", "")

    const customer = await User.findById(vehicle.vehicleOwner._id)
    const expirationDate = new Date(new Date().setMonth(new Date().getMonth() + creditPayment.creditLastsFor))

    creditPayment.vehiclePayedFor = req.body.vehiclePayedFor || creditPayment.vehiclePayedFor
    creditPayment.creditInstitute = req.body.creditInstitute || creditPayment.creditInstitute
    creditPayment.contractNumber = req.body.contractNumber || creditPayment.contractNumber
    creditPayment.boughtFrom = req.body.boughtFrom || creditPayment.boughtFrom
    creditPayment.creditStartDate = req.body.creditStartDate || creditPayment.creditStartDate
    creditPayment.monthlyCreditPayment = req.body.monthlyCreditPayment || creditPayment.monthlyCreditPayment
    creditPayment.interestRate = req.body.interestRate || creditPayment.interestRate
    creditPayment.creditLastsFor = req.body.creditLastsFor || creditPayment.creditLastsFor
    creditPayment.closingRate = req.body.closingRate || creditPayment.closingRate
    creditPayment.kilometersDrivenWhenPurchased = req.body.kilometersDrivenWhenPurchased || creditPayment.kilometersDrivenWhenPurchased
    creditPayment.contractExpiresInNextTwoMonths = expirationDate > new Date() && expirationDate < new Date(new Date().setMonth(new Date().getMonth() + 8))

    vehicle.contractExpiresOn = req.body.creditLastsFor || vehicle.contractExpiresOn
    vehicle.contractExpirationDate = req.body.creditLastsFor && new Date(new Date().setMonth(new Date().getMonth() + +req.body.creditLastsFor)) || vehicle.creditExpirationDate
    vehicle.contractExpiresInNextTwoMonths = expirationDate > new Date() && expirationDate < new Date(new Date().setMonth(new Date().getMonth() + 8))
    vehicle.vehiclePaymentTypeVariant = 'credit'

    await creditPayment.save({ validateBeforeSave: false })
    await vehicle.save({ validateBeforeSave: false })

    try {
        await new UserEmailNotifications().paymentOperations(customer, 'aktualisiert', 'credit', vehicle, formatedChangedValues)
    } catch (err) {
        if (err) {
            console.log(err)
        }
    }

    res.status(202).json({
        message: 'success',
        creditPayment
    })
})

exports.updateLeasingPayment = catchAsync(async (req, res, next) => {
    const leasingPayment = await LeasingPayment.findById(req.params.paymentId)
    const vehicle = await Vehicle.findById(req.body.vehiclePayedFor)

    if (req.body.leasingLastsFor && +req.body.leasingLastsFor !== +leasingPayment.leasingLastsFor) {
        vehicle.leasingExpiresInUpcomingThreeMonthsNotifier = undefined
        vehicle.leasingExpiresInUpcomingSixMonthsNotifier = undefined
    }

    const changedValues = Object.keys(req.body).reduce((a, k) => (JSON.stringify(leasingPayment[k]) !== JSON.stringify(req.body[k]) && (a[k] = req.body[k]), a), {})
    const formatedChangedValues = JSON.stringify(changedValues, null, '\t').replace("{", "").replace("}", "")

    const customer = await User.findById(vehicle.vehicleOwner._id)

    const expirationDate = new Date(new Date().setMonth(new Date().getMonth() + leasingPayment.leasingLastsFor))

    // if (vehicle._id.toString() === leasingPayment.vehiclePayedFor.toString()) {
    leasingPayment.vehiclePayedFor = req.body.vehiclePayedFor || leasingPayment.vehiclePayedFor
    leasingPayment.leasingGiver = req.body.leasingGiver || leasingPayment.leasingGiver
    leasingPayment.contractNumber = req.body.contractNumber || leasingPayment.contractNumber
    leasingPayment.boughtFrom = req.body.boughtFrom || leasingPayment.boughtFrom
    leasingPayment.maintenancePackage = req.body.maintenancePackage || leasingPayment.maintenancePackage
    leasingPayment.leasingStartDate = req.body.leasingStartDate || leasingPayment.leasingStartDate
    leasingPayment.monthlyLeasingPayment = req.body.monthlyLeasingPayment || leasingPayment.monthlyLeasingPayment
    leasingPayment.leasingLastsFor = req.body.leasingLastsFor || leasingPayment.leasingLastsFor
    leasingPayment.remainingPayment = req.body.remainingPayment || leasingPayment.remainingPayment
    leasingPayment.allowedYearlyKilometers = req.body.allowedYearlyKilometers || leasingPayment.allowedYearlyKilometers
    leasingPayment.costsForMoreKilometers = req.body.costsForMoreKilometers || leasingPayment.costsForMoreKilometers
    leasingPayment.costsForLessKilometers = req.body.costsForLessKilometers || leasingPayment.costsForLessKilometers
    leasingPayment.moreDetails = req.body.moreDetails || leasingPayment.moreDetails
    leasingPayment.kilometersDrivenWhenPurchased = req.body.kilometersDrivenWhenPurchased || leasingPayment.kilometersDrivenWhenPurchased
    leasingPayment.contractExpiresInNextTwoMonths = expirationDate > new Date() && expirationDate < new Date(new Date().setMonth(new Date().getMonth() + 8))

    vehicle.contractExpiresOn = req.body.leasingLastsFor || vehicle.contractExpiresOn
    vehicle.contractExpirationDate = req.body.leasingLastsFor && new Date(new Date().setMonth(new Date().getMonth() + +req.body.leasingLastsFor)) || vehicle.leasingExpirationDate
    vehicle.contractExpiresInNextTwoMonths = expirationDate > new Date() && expirationDate < new Date(new Date().setMonth(new Date().getMonth() + 8))
    vehicle.vehiclePaymentTypeVariant = 'leasing'

    await leasingPayment.save({ validateBeforeSave: false })
    await vehicle.save({ validateBeforeSave: false })
    // } else {
    //     return next(new AppError('Die Route ist fehlerhaft, Sie haben keine Berechtigung, diese Aktion durchzuführen.', 400))
    // }

    try {
        await new UserEmailNotifications().paymentOperations(customer, 'aktualisiert', 'leasing', vehicle, formatedChangedValues)
    } catch (err) {
        if (err) {
            console.log(err)
        }
    }

    res.status(202).json({
        message: 'success',
        leasingPayment
    })
})