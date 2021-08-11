const mongoose = require('mongoose')

const vehicleSchema = new mongoose.Schema({
    vehicleOwner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Vehicle must have a owner.']
    },
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1551836989-b4622a17a792?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'
    },
    images: {
        type: Array
    },
    mark: {
        type: String,
        required: [true, 'Please enter the vehicle mark.']
    },
    model: {
        type: String,
        required: [true, 'Please enter the vehicle model.']
    },
    HSN: {
        type: String,
        minLength: [4, 'HSN must be at least 4 characters, got {VALUE}'],
        maxLength: [4, 'HSN must be at least 4 characters, got {VALUE}'],
        required: [true, 'Please enter vehicle HSN information.']
    },
    TSN: {
        type: String,
        maxLength: [3, 'TSN length cannot exceed 3 characters.'],
        required: [true, 'Please enter vehicle TSN information.']
    },
    firstVehicleRegistration: {
        type: Date,
        default: Date.now()
    },
    firstVehicleRegistrationOnOwner: {
        type: Date,
        default: Date.now()
    },
    kilometersDriven: {
        type: Number,
        required: [true, 'Please enter the number of kilometers driven.']
    },
    lastTechnicalInspection: {
        type: Date,
        // required: [true, 'Please tell us the last time the vehicle was on inspection.'],
        default: Date.now()
    },
    nextTechnicalInspection: {
        type: Date,
        default: Date.now()
    },
    TUV: {
        type: Date,
        default: Date.now()
    },
    AU: {
        type: Date,
        default: Date.now()
    },
    insuranceHouse: {
        type: mongoose.Schema.ObjectId,
        ref: 'Insurance',
        // required: [true, 'Please provide insurance house information.']
    },
    monthlyInsurancePayment: {
        type: Number,
        required: [true, 'Please provide your monthly insurance payment.']
    },
    allowedYearlyKilometers: {
        type: Number,
        required: [true, 'Please provide allowed kilometers per year.']
    },
    vehiclePaymentType: {
        type: mongoose.Schema.Types.Mixed,
        ref: 'BanksLeasing',
        // required: [true, 'Please provide your vehicle payment type.']
    },
    yearlyTax: {
        type: Number,
        required: [true, 'Please provide your yearly tax.']
    }
})

const Vehicle = mongoose.model('Vehicle', vehicleSchema)

module.exports = Vehicle