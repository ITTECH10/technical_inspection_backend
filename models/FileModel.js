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