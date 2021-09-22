const mongoose = require('mongoose')

const leasingPaymentSchema = new mongoose.Schema({
    vehiclePayedFor: {
        type: mongoose.Schema.ObjectId,
        ref: 'Vehicle',
        required: [true, 'Please provide for which vehicle you want to pay.']
    },
    leasingGiver: {
        type: mongoose.Schema.ObjectId,
        ref: 'BanksLeasing',
        required: [true, 'Please provide the bank in which the contract has been made.']
    },
    contractNumber: {
        type: Number,
        required: [true, 'Please provide the contract number.']
    },
    boughtFrom: {
        type: String
    },
    maintenancePackage: {
        type: String
    },
    leasingStartDate: {
        type: Date,
        required: [true, 'Please provide the date on which your credit has started.']
    },
    monthlyLeasingPayment: {
        type: Number,
        required: [true, 'Please provide the monthly credit payment.']
    },
    leasingLastsFor: {
        type: Number,
        required: [true, 'Please provide how much the credit lasts for. (in months)']
    },
    remainingPayment: {
        type: Number
    },
    allowedYearlyKilometers: {
        type: Number
    },
    costsForMoreKilometers: {
        type: Number
    },
    costsForLessKilometers: {
        type: Number
    }
})

const LeasingPayment = mongoose.model('LeasingPayment', leasingPaymentSchema)

module.exports = LeasingPayment