const AppError = require("../utils/appError")

const handleDBError = (err) => {
    const msg = `Invalid ${err.path} : ${err.value}`
    return new AppError(msg, 400)
}

const handleDBDuplicate = (err) => {
    const msg = `Duplicate Name Error!, ${err.keyValue.name} is already exsist, Please use other name!`
    return new AppError(msg, 400)
}

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map(el => el.message)

    const message = `Invalid Input data! ${errors.join('. ')}`
    return new AppError(message, 400)
}
const handleJWTError = () => {
    return new AppError('Invalid token, Please login again!', 401)
}

const handleTokenExpiredError = () => {
    return new AppError('Your token has expired!, Please login again!', 401)
}
const devError = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    })
}

const prodError = (err, res) => {
    //operational, trusted error : send msg to clinet
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }//programming or other unknown error : dont leak error details
    else {

        //log the error 
        console.error(err)

        //send generic error msg
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong on server side'
        })
    }
}

module.exports = (err, req, res, next) => {
    // console.log(err.stack)

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        devError(err, res)
    }
    else if (process.env.NODE_ENV === 'production') {
        let error = { ...err }

        if (error.name === 'CastError') error = handleDBError(error)
        if (error.code === 11000) error = handleDBDuplicate(error)
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error)
        if (error.name === 'JsonWebTokenError') error = handleJWTError()
        if (error.name === 'TokenExpiredError') error = handleTokenExpiredError()

        prodError(error, res)

    }
    // next()
}