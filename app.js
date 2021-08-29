const express = require('express')
const userRouter = require('./routers/userRouter')
const carRouter = require('./routers/carRouter')
const bankRouter = require('./routers/bankRouter')
const fileRouter = require('./routers/fileRouter')
const insuranceHouseRouter = require('./routers/insuranceHouseRouter')
const globalErrorHandler = require('./controllers/errorController')
const cors = require('cors')
const fileupload = require('express-fileupload')
const os = require('os')
const cookieParser = require('cookie-parser')

const app = express()

// const origin = process.env.NODE_ENV === 'production' ? 'https://technical-inspection-frontend.vercel.app/' : 'http://localhost:3000'
const origin = 'https://technical-inspection-frontend.vercel.app'

app.use(cors({ credentials: true, origin }));
app.use(cookieParser())
app.use(express.json())

app.use(fileupload({
    useTempFiles: true,
    tempFileDir: os.tmpdir()
}));

// app.use((req, res, next) => {
//     console.log(req.cookies)
//     next()
// })

app.use('/api/v1/users', userRouter)
app.use('/api/v1/cars', carRouter)
app.use('/api/v1/payment', bankRouter)
app.use('/api/v1/insuranceHouse', insuranceHouseRouter)
// app.use('/api/v1/upload', fileRouter)

app.all('*', (req, res, next) => {
    res.status(404).json({
        message: `The requested url ${req.originalUrl} could not be found.`
    })
})

app.use(globalErrorHandler)
module.exports = app