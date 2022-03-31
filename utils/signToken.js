const jwt = require('jsonwebtoken')

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 30
            // Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 5
        ),
        httpOnly: true,
        // secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    }

    if (process.env.NODE_ENV === 'production') {
        cookieOptions.sameSite = 'none'
        cookieOptions.secure = true
    }

    res.cookie('jwt', token, cookieOptions);
    // user.password = undefined;

    res.status(statusCode).json({
        message: 'success',
        token
    });
};

module.exports = createSendToken