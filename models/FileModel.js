const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
    // uploadedBy: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'User'
    // },
    name: {
        type: String
    },
    uploadedFor: {
        type: mongoose.Schema.ObjectId,
        ref: 'Vehicle'
    },
    documentPublisher: {
        type: String,
        required: [true, 'Please tell us who is the document publisher.']
    },
    format: {
        type: String,
    },
    category: {
        type: String,
        required: [true, 'Please choose file category.']
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