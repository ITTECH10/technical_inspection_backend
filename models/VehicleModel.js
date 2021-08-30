const mongoose = require('mongoose')

const vehicleSchema = new mongoose.Schema({
    vehicleOwner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Vehicle must have a owner.']
    },
    thumbnail: {
        type: String
    },
    images: {
        type: Array
    },
    imageCreatedAt: {
        type: Date,
        default: Date.now()
    },
    mark: {
        type: String,
        required: [true, 'Please enter the vehicle mark.']
    },
    model: {
        type: String,
        required: [true, 'Please enter the vehicle model.']
    },
    registrationNumber: {
        type: String,
        required: [true, 'Please enter the vehicle registration number.']
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
        required: [true, 'Please enter the TUV information.']
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
    paymentContractExpires: {
        type: Date,
        required: [true, 'Please specify when your payment contract expires.']
    },
    yearlyTax: {
        type: Number,
        required: [true, 'Please provide your yearly tax.']
    }
})

const Vehicle = mongoose.model('Vehicle', vehicleSchema)

module.exports = Vehicle