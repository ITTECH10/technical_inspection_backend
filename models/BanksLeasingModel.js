const mongoose = require('mongoose')

const BanksLeasingSchema = new mongoose.Schema({
    banksLeasingOwner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        // required: [true, 'Banks and leasing information must be filled out.']
    },
    name: {
        type: String,
        required: [true, 'Plase provide the bank name.']
    },
    streetAddress: {
        type: String,
        required: [true, 'Please provide the bank street location.']
    },
    numberAddress: {
        type: String,
        required: [true, 'Please provide the bank address number.']
    },
    postNumber: {
        type: Number,
        required: [true, 'Please provide the bank post number.']
    },
    city: {
        type: String,
        required: [true, 'Please provide the bank city location.']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please provide the bank phone number.']
    }
})

const BanksLeasing = mongoose.model('BanksLeasing', BanksLeasingSchema)

module.exports = BanksLeasing