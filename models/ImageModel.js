const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
    // uploadedBy: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'User'
    // },
    uploadedFor: {
        type: mongoose.Schema.ObjectId,
        ref: 'Vehicle'
    },
    url: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const Image = mongoose.model('Image', imageSchema)

module.exports = Image