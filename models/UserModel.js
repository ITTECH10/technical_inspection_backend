const mongoose = require('mongoose')
const validatorPackage = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please enter customers name.']
    },
    lastName: {
        type: String,
        required: [true, 'Please enter customers last name.']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email.'],
        validate: {
            validator: function (val) {
                return validatorPackage.isEmail(val)
            },
            message: 'Please use a correct email format.'
        },
        unique: true
    },
    role: {
        type: String,
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password.'],
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm the password.'],
        validate: {
            validator: function (val) {
                return val === this.password
            },
            message: "Passwords do not match."
        }
    }
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return
    this.password = await bcrypt.hash(this.password, 12)
    this.confirmPassword = undefined

    next()
})

userSchema.methods.comparePasswords = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
};

const User = mongoose.model('User', userSchema)

module.exports = User