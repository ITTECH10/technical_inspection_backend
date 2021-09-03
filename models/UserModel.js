const mongoose = require('mongoose')
const validatorPackage = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please enter customers name']
    },
    lastName: {
        type: String,
        required: [true, 'Please enter customers last name']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        validate: {
            validator: function (val) {
                return validatorPackage.isEmail(val)
            },
            message: 'Please use a correct email format'
        },
        unique: true
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please provide a phone number']
    },
    street: {
        type: String,
        required: [true, 'Please provide the street']
    },
    postCode: {
        type: String,
        required: [true, 'Please provide the post code']
    },
    city: {
        type: String,
        required: [true, 'Please provide the city']
    },
    birthDate: {
        type: Date,
        required: [true, 'Please provide birth date']
    },
    role: {
        type: String,
        default: 'user'
    },
    policiesAccepted: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm the password'],
        validate: {
            validator: function (val) {
                return val === this.password
            },
            message: "Passwords do not match"
        }
    },
    passwordResetToken: {
        type: String,
        default: undefined
    },
    passwordResetTokenExpiresIn: {
        type: String,
        default: undefined
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

userSchema.methods.createPasswordResetToken = function () {
    const plainToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(plainToken).digest('hex');
    this.passwordResetTokenExpiresIn = Date.now() + 10 * 60 * 1000;

    return plainToken;
};

const User = mongoose.model('User', userSchema)

module.exports = User