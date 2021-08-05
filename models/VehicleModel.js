const mongoose = require('mongoose')

const vehicleSchema = new mongoose.Schema({
    vehicleOwner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Vehicle must have a owner.']
    },
    image: {
        type: String
    },
    images: {
        type: Array
    },
    model: {
        type: String,
        required: [true, 'Please enter the vehicle model.']
    },
    lastTechnicalInspection: {
        type: Date,
        required: [true, 'Please tell us the last time the vehicle was on inspection.'],
        default: Date.now()
    },
    modelDetails: {
        type: String,
        // required: [true, 'Please tell us more details about this model.']
    }
})

const Vehicle = mongoose.model('Vehicle', vehicleSchema)

module.exports = Vehicle