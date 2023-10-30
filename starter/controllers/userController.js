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

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id
    next()
}

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

exports.getAllUsers = factory.getAll(User)

exports.getUser = factory.getOne(User)

exports.updateUser = factory.updateOne(User)

exports.deleteUser = factory.deleteOne(User)

exports.createNewUser = catchAsyncErr(async (req, res, next) => {

    res.status(500).json({
        status: "error",
        message: "Please Use /signup !"
    })
})