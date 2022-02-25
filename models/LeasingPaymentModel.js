const mongoose = require('mongoose')
const DateGenerator = require('../utils/DateGenerator')

const leasingPaymentSchema = new mongoose.Schema({
    vehiclePayedFor: {
        type: mongoose.Schema.ObjectId,
        ref: 'Vehicle',
        required: [true, 'Please provide for which vehicle you want to pay.']
    },
    leasingGiver: {
        type: String,
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
    leasingEndsOn: {
        type: Date
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
    },
    moreDetails: {
        type: String
    },
    kilometersDrivenWhenPurchased: {
        type: Number,
    }
})

leasingPaymentSchema.pre('save', function (next) {
    this.leasingEndsOn = new DateGenerator().monthsFromNow(this.leasingLastsFor)
    next()
})

leasingPaymentSchema.pre(/^find/, function () {
    this.populate('vehiclePayedFor')
})

const LeasingPayment = mongoose.model('LeasingPayment', leasingPaymentSchema)

module.exports = LeasingPayment