const mongoose = require('mongoose')

const insuranceHouseSchema = new mongoose.Schema({
    insuranceOwner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    insuranceConnectedVehicle: {
        type: mongoose.Schema.ObjectId,
        ref: 'Vehicle'
    },
    insuranceHouse: {
        type: String,
        required: [true, 'Please enter the insurance house name.']
    },
    contractNumber: {
        type: Number
    },
    fullKasko: {
        type: String
    },
    partKasko: {
        type: String
    },
    insuranceCost: {
        type: Number
    },
    insuranceCostType: {
        type: String
    },
    allowedYearlyKilometers: {
        type: Number
    },
    protectionLetter: {
        type: Boolean
    },
    ADAC: {
        type: Boolean
    },
    membershipNumber: {
        type: String
    }
})

const Insurance = mongoose.model('Insurance', insuranceHouseSchema)

module.exports = Insurance