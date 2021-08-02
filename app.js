const express = require('express')
const userRouter = require('./routers/userRouter')
const globalErrorHandler = require('./controllers/errorController')

const app = express()
app.use(express.json())

app.use('/api/v1/users', userRouter)

app.all('*', (req, res, next) => {
    res.status(404).json({
        message: `The requested url ${req.originalUrl} could not be found.`
    })
})

app.use(globalErrorHandler)

module.exports = app