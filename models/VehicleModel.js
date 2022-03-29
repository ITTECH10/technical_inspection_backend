const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const vehicleSchema = new mongoose.Schema({
    vehicleOwner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Das Fahrzeug muss einen Besitzer haben.']
    },
    thumbnail: {
        type: String
    },
    images: {
        type: Array
    },
    driver: {
        type: String
    },
    chassisNumber: {
        type: String
    },
    mark: {
        type: String,
        // required: [true, 'Please enter the vehicle mark.']
    },
    model: {
        type: String,
        // required: [true, 'Please enter the vehicle model.']
    },
    registrationNumber: {
        type: String,
        // required: [true, 'Please enter the vehicle registration number.']
    },
    HSN: {
        type: String,
        minLength: [4, 'Die HSN muss aus mindestens 4 Zeichen bestehen und hat {VALUE}'],
        maxLength: [4, 'Die HSN muss aus mindestens 4 Zeichen bestehen und hat {VALUE}'],
        // required: [true, 'Please enter vehicle HSN information.']
    },
    TSN: {
        type: String,
        maxLength: [3, 'Die TSN-Länge darf 3 Zeichen nicht überschreiten.'],
        // required: [true, 'Please enter vehicle TSN information.']
    },
    varantyExpiresAt: {
        type: Date
    },
    lastUUV: {
        type: Date
    },
    nextUUV: {
        type: Date
    },
    firstVehicleRegistration: {
        type: Date,
        // required: [true, 'Please provide first vehicle registration date.']
    },
    firstVehicleRegistrationOnOwner: {
        type: Date,
        // required: [true, 'Please provide first vehicle registration on owner date.']
    },
    kilometersDriven: {
        type: Number,
        // required: [true, 'Please enter the number of kilometers driven.']
    },
    lastTechnicalInspection: {
        type: Date,
        // required: [true, 'Please tell us the last time the vehicle was on inspection.']
    },
    nextTechnicalInspection: {
        type: Date,
        // required: [true, 'Please specify next vehicle registration date.']
    },
    technicalInspectionInNextTwoMonths: {
        type: Boolean,
    },
    TUV: {
        type: Date,
        // required: [true, 'Please enter the TUV information.']
    },
    TUVExpiresInOneMonth: {
        type: Boolean,
        // required: [true, 'Calculation if TUV expires in next month went wrong...']
    },
    TUVExpiresInTwoMonths: {
        type: Boolean
    },
    AU: {
        type: Date,
        // required: [true, 'Please provide AU date.']
    },
    AUExpiresInTwoMonths: {
        type: Boolean
    },
    insuranceHouse: {
        type: mongoose.Schema.ObjectId,
        ref: 'Insurance'
    },
    monthlyInsurancePayment: {
        type: Number,
        // required: [true, 'Please provide your monthly insurance payment.']
    },
    allowedYearlyKilometers: {
        type: Number,
        // required: [true, 'Please provide allowed kilometers per year.']
    },
    vehiclePaymentType: {
        type: mongoose.Schema.Types.Mixed
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
        // required: [true, 'Please provide your yearly tax.']
    },
    carIsSold: {
        type: Boolean,
        default: false
    },
    carIsSoldTo: {
        type: String
    },
    carIsSoldDate: {
        type: Date
    },
    markForSelling: {
        type: Boolean
    },
    adminNotifiedAboutCarSelling: {
        type: Boolean
    },
    protectionLetter: {
        type: Boolean
    },
    ADAC: {
        type: Boolean
    },
    membershipNumber: {
        type: String
    },
    ntiServiceExpiresInOneMonthEmailNotifier: {
        type: String
    },
    TuvExpiresInNextMonthNotifier: {
        type: String
    },
    TuvExpiresInNextTwoMonthsNotifier: {
        type: String
    },
    AuExpiresInNextMonthNotifier: {
        type: String
    },
    AuExpiresInNextTwoMonthsNotifier: {
        type: String
    },
    creditExpiresInUpcomingThreeMonthsNotifier: {
        type: String
    },
    creditExpiresInUpcomingSixMonthsNotifier: {
        type: String
    },
    leasingExpiresInUpcomingThreeMonthsNotifier: {
        type: String
    },
    leasingExpiresInUpcomingSixMonthsNotifier: {
        type: String
    },
})

vehicleSchema.pre(/^find/, function () {
    this.populate('vehicleOwner')
})

// vehicleSchema.virtual('tuvExpired').get(function () {
//     // return new Date(this.TUV) < new Date()
//     console.log(this)
// });

// NTI-SERVICE EXPIRES IN ONE MONTH EMAIL HASH GENERATOR
vehicleSchema.methods.createNtiServiceExpiresInOneMonthEmailNotifier = async function (vehicleOwner) {
    this.ntiServiceExpiresInOneMonthEmailNotifier = await bcrypt.hash(`${vehicleOwner}`, 12)
}

// TUV EXPIRED HASH GENERATOR
vehicleSchema.methods.createTuvExpiresInNextMonthNotifier = async function (vehicleOwner) {
    this.TuvExpiresInNextMonthNotifier = await bcrypt.hash(`${vehicleOwner}`, 12)
};

vehicleSchema.methods.createTuvExpiresInNextTwoMonthsNotifier = async function (vehicleOwner) {
    this.TuvExpiresInNextTwoMonthsNotifier = await bcrypt.hash(`${vehicleOwner}`, 12)
};

// AU EXPIRED HASH GENERATOR
vehicleSchema.methods.createAuExpiresInNextMonthNotifier = async function (vehicleOwner) {
    this.AuExpiresInNextMonthNotifier = await bcrypt.hash(`${vehicleOwner}`, 12)
};

vehicleSchema.methods.createAuExpiresInNextTwoMonthsNotifier = async function (vehicleOwner) {
    this.AuExpiresInNextTwoMonthsNotifier = await bcrypt.hash(`${vehicleOwner}`, 12)
};

// CREDIT EXPIRED HASH GENERATOR
vehicleSchema.methods.createFinansesExpiresInThreeMonthsEmailNotifier = async function (vehicleOwner) {
    this.creditExpiresInUpcomingThreeMonthsNotifier = await bcrypt.hash(`${vehicleOwner}`, 12)
};

vehicleSchema.methods.createFinansesExpiresInSixMonthsEmailNotifier = async function (vehicleOwner) {
    this.creditExpiresInUpcomingSixMonthsNotifier = await bcrypt.hash(`${vehicleOwner}`, 12)
};

// LEASING EXPIRED HASH GENERATOR
vehicleSchema.methods.createLeasingExpiresInThreeMonthsEmailNotifier = async function (vehicleOwner) {
    this.leasingExpiresInUpcomingThreeMonthsNotifier = await bcrypt.hash(`${vehicleOwner}`, 12)
};

vehicleSchema.methods.createLeasingExpiresInSixMonthsEmailNotifier = async function (vehicleOwner) {
    this.leasingExpiresInUpcomingSixMonthsNotifier = await bcrypt.hash(`${vehicleOwner}`, 12)
};

const Vehicle = mongoose.model('Vehicle', vehicleSchema)

module.exports = Vehicle