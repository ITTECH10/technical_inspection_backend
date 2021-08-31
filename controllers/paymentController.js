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
    vehicle.vehiclePaymentType = newCashPayment._id
    vehicle.vehiclePaymentTypeVariant = 'cash'
    vehicle.save({ validateBeforeSave: false })

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

    const vehicle = await Vehicle.findById(req.params.carId)
    vehicle.vehiclePaymentType = newCreditPayment._id
    vehicle.contractExpiresOn = newCreditPayment.creditLastsFor
    vehicle.vehiclePaymentTypeVariant = 'credit'
    vehicle.save({ validateBeforeSave: false })

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

    const vehicle = await Vehicle.findById(req.params.carId)
    vehicle.vehiclePaymentType = newLeasingPayment._id
    vehicle.contractExpiresOn = newLeasingPayment.leasingLastsFor
    vehicle.vehiclePaymentTypeVariant = 'leasing'
    vehicle.save({ validateBeforeSave: false })

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