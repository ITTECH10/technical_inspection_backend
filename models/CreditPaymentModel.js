const mongoose = require('mongoose')

const creditPaymentSchema = new mongoose.Schema({
    vehiclePayedFor: {
        type: mongoose.Schema.ObjectId,
        ref: 'Vehicle',
        required: [true, 'Please provide for which vehicle you want to pay.']
    },
    creditInstitute: {
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
    creditStartDate: {
        type: Date,
        required: [true, 'Please provide the date on which your credit has started.']
    },
    monthlyCreditPayment: {
        type: Number,
        required: [true, 'Please provide the monthly credit payment.']
    },
    interestRate: {
        type: Number,
        required: [true, 'Please provide the interest rate.']
    },
    creditLastsFor: {
        type: Number,
        required: [true, 'Please provide how much the credit lasts for. (in months)']
    },
    closingRate: {
        type: Number
    }
})

const CreditPayment = mongoose.model('CreditPayment', creditPaymentSchema)

module.exports = CreditPayment