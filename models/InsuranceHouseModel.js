const mongoose = require('mongoose')

const insuranceHouseSchema = new mongoose.Schema({
    insuranceOwner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Insurance House information must be filled out.']
    },
    name: {
        type: String,
        required: [true, 'Please enter the insurance house name.']
    },
    streetAddress: {
        type: String,
        required: [true, 'Please enter the insurance house address street.']
    },
    numberAddress: {
        type: String,
        required: [true, 'Please enter the insurance house address number.']
    },
    postNumber: {
        type: Number,
        required: [true, 'Please enter the insurance house post number.']
    },
    city: {
        type: String,
        required: [true, 'Please enter the insurance house city location.']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please enter the insurance house phone number.']
    }
})

const Insurance = mongoose.model('Insurance', insuranceHouseSchema)

module.exports = Insurance