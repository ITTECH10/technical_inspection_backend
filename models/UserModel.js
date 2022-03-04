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
    gender: {
        type: String
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
    customerType: {
        type: String
    },
    corespondencePartner: {
        type: String
    },
    corespondencePartnerEmail: {
        type: String,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please provide a phone number (fax).']
    },
    smartphoneNumber: {
        type: String,
        required: [true, 'Please provide a phone number (smartphone).']
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
        default: 'user',
        enum: ['user', 'admin']
    },
    policiesAccepted: {
        type: Boolean,
        default: false
    },
    firstLogIn: {
        type: Boolean,
        default: true
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
    },
    AuExpiredEmailNotifier: {
        type: String
    },
    leasingExpiredEmailNotifier: {
        type: String
    },
    finansesExpiredEmailNotifier: {
        type: String
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

// TUV EMAIL HASH GENERATOR
// userSchema.methods.createTuvEmailExpiredNotifier = async function (vehicleOwner) {
//     this.TuvExpiredEmailNotifier = await bcrypt.hash(`${vehicleOwner}`, 12)
// };

// userSchema.methods.compareTuvEmailExpiredNotifier = async function (candidateTuvEmailExpiredNotifier, userTuvEmailExpiredNotifier) {
//     return await bcrypt.compare(candidateTuvEmailExpiredNotifier, userTuvEmailExpiredNotifier)
// }

// AU EMAIL HASH GENERATOR
userSchema.methods.createAuEmailExpiredNotifier = async function (vehicleOwner) {
    this.AuExpiredEmailNotifier = await bcrypt.hash(`${vehicleOwner}`, 12)
};

userSchema.methods.compareAuEmailExpiredNotifier = async function (candidateAuEmailExpiringNotifier, userAuEmailExpiringNotifier) {
    return await bcrypt.compare(candidateAuEmailExpiringNotifier, userAuEmailExpiringNotifier)
}

// LEASING EMAIL HASH GENERATOR
userSchema.methods.createLeasingExpiredEmailNotifier = async function (vehicleOwner) {
    this.leasingExpiredEmailNotifier = await bcrypt.hash(`${vehicleOwner}`, 12)
};

userSchema.methods.compareLeasingEmailExpiredNotifier = async function (candidateLeasingEmailExpiredNotifier, userLeasingEmailExpiredNotifier) {
    return await bcrypt.compare(`${candidateLeasingEmailExpiredNotifier}`, userLeasingEmailExpiredNotifier)
}

// FINANSES EMAIL HASH GENERATOR
userSchema.methods.createFinansesExpiredEmailNotifier = async function (vehicleOwner) {
    this.finansesExpiredEmailNotifier = await bcrypt.hash(`${vehicleOwner}`, 12)
};

userSchema.methods.compareFinansesEmailExpiredNotifier = async function (candidateLeasingEmailExpiredNotifier, userLeasingEmailExpiredNotifier) {
    return await bcrypt.compare(`${candidateLeasingEmailExpiredNotifier}`, userLeasingEmailExpiredNotifier)
}

const User = mongoose.model('User', userSchema)

module.exports = User