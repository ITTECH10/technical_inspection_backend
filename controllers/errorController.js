const AppError = require('../utils/appError')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config({
    path: path.join(__dirname, '../config.env')
})

const handleCastErrorDB = err => {
    const message = `Ungültig ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
    const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    let message = `Doppelter Feldwert: ${value}. Bitte verwenden Sie einen anderen Wert!`;

    if (err.message.includes('email')) {
        message = 'Die verwendete E-Mail Adresse existiert bereits!'
    }

    return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);

    const message = `Ungültige Eingabedaten. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = () =>
    new AppError('Ungültiges Token. Bitte melden Sie sich erneut an!', 401);

const handleJWTExpiredError = () =>
    new AppError('Ihr Token ist abgelaufen! Bitte melden Sie sich erneut an.', 401);

const sendDevErrors = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    })
}

const sendProdErrors = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }

    else {
        res.status(500).json({
            status: 'error',
            message: 'Etwas ist schief gelaufen!'
        })
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        sendDevErrors(err, res)
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;

        if (error.message.startsWith('Cast')) error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error._message && error._message.includes('validation')) error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendProdErrors(error, res);
    }
}