const express = require('express')
const userRouter = require('./routers/userRouter')
const carRouter = require('./routers/carRouter')
const globalErrorHandler = require('./controllers/errorController')
const cors = require('cors')
const fileupload = require('express-fileupload')
const os = require('os')

const app = express()
app.use(cors())
app.use(express.json())

app.use(fileupload({
    useTempFiles: true,
    tempFileDir: os.tmpdir()
}));

app.use('/api/v1/users', userRouter)
app.use('/api/v1/cars', carRouter)

app.all('*', (req, res, next) => {
    res.status(404).json({
        message: `The requested url ${req.originalUrl} could not be found.`
    })
})

app.use(globalErrorHandler)

module.exports = app