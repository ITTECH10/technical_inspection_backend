const express = require('express')
const AppError = require('./utils/appError')
const userRouter = require('./routers/userRouter')
const carRouter = require('./routers/carRouter')
const bankRouter = require('./routers/bankRouter')
const paymentRouter = require('./routers/paymentRouter')
const insuranceHouseRouter = require('./routers/insuranceHouseRouter')
const globalErrorHandler = require('./controllers/errorController')
const cors = require('cors')
const fileupload = require('express-fileupload')
const os = require('os')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')

const app = express()
const origin = process.env.NODE_ENV === 'production' ? 'https://secarmanagement.vercel.app' : 'http://localhost:3000'

// SECURITY HEADERS
app.use(helmet())

app.use(cors({ credentials: true, origin }));
app.use(cookieParser())

// CONSIDER LIMITING REQ.BODY
app.use(express.json())

// DATA SANITIZATION
app.use(mongoSanitize())
app.use(xss())

app.use(fileupload({
    useTempFiles: true,
    tempFileDir: os.tmpdir()
}));

// TEST MIDLEWARE
// app.use((req, res, next) => {
//     console.log(req.cookies)
//     next()
// })

app.use('/api/v1/users', userRouter)
app.use('/api/v1/cars', carRouter)
app.use('/api/v1/payment', bankRouter)
app.use('/api/v1/insuranceHouse', insuranceHouseRouter)
app.use('/api/v1/contracts', paymentRouter)
// app.use('/api/v1/upload', fileRouter)

app.all('*', (req, res, next) => {
    next(new AppError(`The requested url ${req.originalUrl} could not be found.`, 404))
})

app.use(globalErrorHandler)
module.exports = app