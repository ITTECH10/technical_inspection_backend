const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
    // uploadedBy: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'User'
    // },
    uploadedFor: {
        type: mongoose.Schema.ObjectId,
        ref: 'Vehicle'
    },
    format: {
        type: String,
    },
    url: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const File = mongoose.model('File', fileSchema)

module.exports = File