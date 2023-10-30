const AppError = require("../utils/appError")
const catchAsyncErr = require("../utils/catchAsyncErr")
const User = require('./../model/usermodel')
const factory = require('./handlerFactory')

const filterObj = (obj, ...allowedData) => {
    const newObj = {}
    Object.keys(obj).forEach((el) => {
        if (allowedData.includes(el)) {
            newObj[el] = obj[el]
        }
    })
    return newObj
}

exports.getAllUsers = catchAsyncErr(async (req, res, next) => {
    const users = await User.find()

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    })
})

exports.updateMe = catchAsyncErr(async (req, res, next) => {

    //1. create error if user POSTs password data
    if (req.body.password || req.body.confirmPassword) {
        return next(new AppError('This route is not for update the password, Please! use, /updateMyPassword', 400))
    }

    //filtered out unwanted data that aren't allowed to be updated  
    const filteredBody = filterObj(req.body, "name", "email")

    //update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true })

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    })
})

exports.deleteMe = catchAsyncErr(async (req, res) => {

    await User.findByIdAndUpdate(req.user.id, { active: false })

    res.status(204).json({
        status: 'success',
        data: null
    })
})

exports.getUser = (req, res) => {
    console.log(req.reqTime)
    res.status(500).json({
        status: 'error',
        time: req.reqTime,
        message: 'This route isn\'t implemented...'
    })
}

exports.updateUser = factory.updateOne(User)

exports.deleteUser = factory.deleteOne(User)

exports.createNewUser = catchAsyncErr(async (req, res, next) => {

    const newUser = await User.create(req.body)
    res.status(201).json({
        status: "success",
        data: {
            user: newUser
        }
    })
    next()
})