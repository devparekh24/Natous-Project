const path = require('path')
const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const AppError = require('./utils/appError')
const errorController = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const viewRouter = require('./routes/viewRoutes')

const app = express()

//template engine pug
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

//Global middleware

//serving static file
// app.use(express.static(`${__dirname}/public`))
app.use(express.static(path.join(__dirname, 'public')))

//set security http headers
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}))//collection of 14 smaller middleware fn that set http res header.

//development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//limit the request from same api (ip add)
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, Please Try Again in an hour!!'
})
app.use('/api', limiter)

//body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }))//middleware

//Data sanitization against NoSQL query injection
app.use(mongoSanitize())

//Data sanitization against XSS
app.use(xss())

//prevent parameter pollution
app.use(hpp({
    whitelist: [
        'duration',
        'maxGroupSize',
        'difficulty',
        'ratingsAverage',
        'ratingsQuantity',
        'price'
    ]
}))

//test middleware
// app.use((req, res, next) => {
//     console.log('Hello from middleware....')
//     next();
// })

//test middleware
// app.use((req, res, next) => {
//     req.reqTime = new Date().toISOString()
//     console.log(req.headers)
//     next();
// })

// console.log(app.get('env'))
// app.use(morgan('dev'))

//routes

app.use('/', viewRouter)
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)

app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: "fail",
    //     message: `Can't find ${req.originalUrl} on this server!`
    // })

    // const err = new Error(`Can't find ${req.originalUrl} on this server!`)
    // err.statusCode = 404;
    // err.status = 'fail'

    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

//central error handling middleware
app.use(errorController)

module.exports = app