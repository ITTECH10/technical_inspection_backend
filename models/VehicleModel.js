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
        required: [true, 'Please provide first vehicle registration date.']
    },
    firstVehicleRegistrationOnOwner: {
        type: Date,
        required: [true, 'Please provide first vehicle registration on owner date.']
    },
    kilometersDriven: {
        type: Number,
        required: [true, 'Please enter the number of kilometers driven.']
    },
    lastTechnicalInspection: {
        type: Date,
        required: [true, 'Please tell us the last time the vehicle was on inspection.']
    },
    nextTechnicalInspection: {
        type: Date,
        required: [true, 'Please specify next vehicle registration date.']
    },
    TUV: {
        type: Date,
        required: [true, 'Please enter the TUV information.']
    },
    TUVExpiresInOneMonth: {
        type: Boolean,
        required: [true, 'Calculation if TUV expires in next month went wrong...']
    },
    TUVExpiresInFourteenDays: {
        type: Boolean,
        required: [true, 'Calculation if TUV expires in fourteen days went wrong...']
    },
    AU: {
        type: Date,
        required: [true, 'Please provide AU date.']
    },
    insuranceHouse: {
        type: mongoose.Schema.ObjectId,
        ref: 'Insurance'
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
    },
    // IMPROVE LATER THINGS BELLOW
    vehiclePaymentTypeVariant: {
        type: String
    },
    contractExpiresOn: {
        type: Number,
        // required: [true, 'Please specify when your payment contract expires.']
    },
    contractExpirationDate: {
        type: Date,
        // required: [true, 'Please specify the date when your contract expires.']
    },
    contractExpiresInNextTwoMonths: {
        type: Boolean,
        // required: [true, 'Credit calculation for two months ahead failed...']
    },
    yearlyTax: {
        type: Number,
        required: [true, 'Please provide your yearly tax.']
    }
})

const Vehicle = mongoose.model('Vehicle', vehicleSchema)

module.exports = Vehicle