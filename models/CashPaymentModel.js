const mongoose = require('mongoose')

const cashPaymentSchema = new mongoose.Schema({
    vehiclePayedFor: {
        type: mongoose.Schema.ObjectId,
        ref: 'Vehicle',
        required: [true, 'Please provide for which vehicle you want to pay.']
    },
    payedAt: {
        type: Date,
        required: [true, 'Please provide the payed at date.']
    },
    boughtFrom: {
        type: String
    },
    cashSum: {
        type: Number,
        required: [true, 'Please provide the payed sum.']
    },
    kilometersDrivenWhenPurchased: {
        type: Number,
    }
})

const CashPayment = mongoose.model('CashPayment', cashPaymentSchema)

module.exports = CashPayment