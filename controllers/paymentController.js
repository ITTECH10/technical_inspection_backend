const AppError = require('./../utils/appError')
const catchAsync = require('./../utils/catchAsync')
const CashPayment = require('./../models/CashPaymentModel')
const CreditPayment = require('./../models/CreditPaymentModel')
const LeasingPayment = require('./../models/LeasingPaymentModel')
const Vehicle = require('./../models/VehicleModel')

exports.createCashPayment = catchAsync(async (req, res, next) => {
    const newCashPayment = await CashPayment.create({
        vehiclePayedFor: req.params.carId,
        payedAt: req.body.payedAt,
        cashSum: req.body.cashSum
    })

    const vehicle = await Vehicle.findById(req.params.carId)

    if (vehicle._id.toString() !== req.params.carId.toString()) {
        return next(new AppError('Route malformed, you do not have permissions to perform this action.', 400))
    }

    vehicle.vehiclePaymentType = newCashPayment._id
    vehicle.vehiclePaymentTypeVariant = 'cash'
    await vehicle.save({ validateBeforeSave: false })

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
        creditStartDate: req.body.creditStartDate,
        monthlyCreditPayment: req.body.monthlyCreditPayment,
        interestRate: req.body.interestRate,
        creditLastsFor: req.body.creditLastsFor,
        closingRate: req.body.closingRate
    })

    const expirationDate = new Date(new Date().setMonth(new Date().getMonth() + newCreditPayment.creditLastsFor))

    const vehicle = await Vehicle.findById(req.params.carId)
    vehicle.vehiclePaymentType = newCreditPayment._id
    vehicle.contractExpiresOn = newCreditPayment.creditLastsFor
    vehicle.contractExpirationDate = new Date(new Date().setMonth(new Date().getMonth() + newCreditPayment.creditLastsFor))
    vehicle.contractExpiresInNextTwoMonths = expirationDate > new Date() && expirationDate < new Date(new Date().setMonth(new Date().getMonth() + 2))
    vehicle.vehiclePaymentTypeVariant = 'credit'
    await vehicle.save({ validateBeforeSave: false })

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
        leasingStartDate: req.body.leasingStartDate,
        monthlyLeasingPayment: req.body.monthlyLeasingPayment,
        leasingLastsFor: req.body.leasingLastsFor,
        remainingPayment: req.body.remainingPayment,
        allowedYearlyKilometers: req.body.allowedYearlyKilometers,
        costsForMoreKilometers: req.body.costsForMoreKilometers,
        costsForLessKilometers: req.body.costsForLessKilometers
    })

    const expirationDate = new Date(new Date().setMonth(new Date().getMonth() + newLeasingPayment.leasingLastsFor))

    const vehicle = await Vehicle.findById(req.params.carId)
    vehicle.vehiclePaymentType = newLeasingPayment._id
    vehicle.contractExpiresOn = newLeasingPayment.leasingLastsFor
    vehicle.contractExpirationDate = expirationDate
    vehicle.contractExpiresInNextTwoMonths = expirationDate > new Date() && expirationDate < new Date(new Date().setMonth(new Date().getMonth() + 2))
    vehicle.vehiclePaymentTypeVariant = 'leasing'
    await vehicle.save({ validateBeforeSave: false })

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

    if (vehicle._id.toString() === cashPayment.vehiclePayedFor.toString()) {
        cashPayment.vehiclePayedFor = req.body.vehiclePayedFor || cashPayment.vehiclePayedFor
        cashPayment.payedAt = req.body.payedAt || cashPayment.payedAt
        cashPayment.cashSum = req.body.cashSum || cashPayment.cashSum
        await cashPayment.save()
    } else {
        return next(new AppError('Route malformed, you do not have permissions to perform this action.', 400))
    }

    res.status(202).json({
        message: 'success',
        cashPayment
    })
})

exports.updateCreditPayment = catchAsync(async (req, res, next) => {
    const creditPayment = await CreditPayment.findById(req.params.paymentId)
    const vehicle = await Vehicle.findById(req.body.vehiclePayedFor)

    if (vehicle._id.toString() === creditPayment.vehiclePayedFor.toString()) {
        creditPayment.vehiclePayedFor = req.body.vehiclePayedFor || creditPayment.vehiclePayedFor
        creditPayment.creditInstitute = req.body.creditInstitute || creditPayment.creditInstitute
        creditPayment.contractNumber = req.body.contractNumber || creditPayment.contractNumber
        creditPayment.creditStartDate = req.body.creditStartDate || creditPayment.creditStartDate
        creditPayment.monthlyCreditPayment = req.body.monthlyCreditPayment || creditPayment.monthlyCreditPayment
        creditPayment.interestRate = req.body.interestRate || creditPayment.interestRate
        creditPayment.creditLastsFor = req.body.creditLastsFor || creditPayment.creditLastsFor
        creditPayment.closingRate = req.body.closingRate || creditPayment.closingRate
        await creditPayment.save()
    } else {
        return next(new AppError('Route malformed, you do not have permissions to perform this action.', 400))
    }

    res.status(202).json({
        message: 'success',
        creditPayment
    })
})

exports.updateLeasingPayment = catchAsync(async (req, res, next) => {
    const leasingPayment = await LeasingPayment.findById(req.params.paymentId)
    const vehicle = await Vehicle.findById(req.body.vehiclePayedFor)

    if (vehicle._id.toString() === leasingPayment.vehiclePayedFor.toString()) {
        leasingPayment.vehiclePayedFor = req.body.vehiclePayedFor || leasingPayment.vehiclePayedFor
        leasingPayment.leasingGiver = req.body.leasingGiver || leasingPayment.leasingGiver
        leasingPayment.contractNumber = req.body.contractNumber || leasingPayment.contractNumber
        leasingPayment.leasingStartDate = req.body.leasingStartDate || leasingPayment.leasingStartDate
        leasingPayment.monthlyLeasingPayment = req.body.monthlyLeasingPayment || leasingPayment.monthlyLeasingPayment
        leasingPayment.leasingLastsFor = req.body.leasingLastsFor || leasingPayment.leasingLastsFor
        leasingPayment.remainingPayment = req.body.remainingPayment || leasingPayment.remainingPayment
        leasingPayment.allowedYearlyKilometers = req.body.allowedYearlyKilometers || leasingPayment.allowedYearlyKilometers
        leasingPayment.costsForMoreKilometers = req.body.costsForMoreKilometers || leasingPayment.costsForMoreKilometers
        leasingPayment.costsForLessKilometers = req.body.costsForLessKilometers || leasingPayment.costsForLessKilometers
        await leasingPayment.save()
    } else {
        return next(new AppError('Route malformed, you do not have permissions to perform this action.', 400))
    }

    res.status(202).json({
        message: 'success',
        leasingPayment
    })
})