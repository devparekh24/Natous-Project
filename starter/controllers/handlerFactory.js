const AppError = require('./../utils/appError')
const catchAsyncErr = require('../utils/catchAsyncErr')

// exports.deleteTour = catchAsyncErr(async (req, res, next) => {
//     const tour = await Tour.findByIdAndDelete(req.params.id)
//     if (!tour) {
//         return next(new AppError('No tour found with that ID', 404))
//     }

//     res.status(204).json({
//         status: 'success',
//         data: null
//     })
// })

exports.deleteOne = (Model) => catchAsyncErr(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id)
    if (!doc) {
        return next(new AppError('No document found with that ID', 404))
    }

    res.status(204).json({
        status: 'success',
        data: null
    })
})

// exports.updateTour = catchAsyncError(async (req, res, next) => {
//     // try {
//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//         runValidators: true
//     })

//     if (!tour) {
//         return next(new AppError('No tour found with that ID', 404))
//     }

//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour
//         }
//     })
//     // }
//     // catch (err) {
//     //     res.status(404).json({
//     //         status: "fail",
//     //         message: err
//     //     })
//     // }

// })

exports.updateOne = (Model) => catchAsyncErr(async (req, res, next) => {

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if (!doc) {
        return next(new AppError('No document found with that ID', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    })
})

// exports.createNewTour = catchAsyncError(async (req, res, next) => {
//     // console.log(req.body)
//     // try {

//     //2nd type
//     const newTour = await Tour.create(req.body)
//     res.status(201).json({
//         status: "success",
//         data: {
//             tour: newTour
//         }
//     })
//     // } catch (err) {
//     //     console.log(err)
//     //     res.status(400).json({
//     //         status: "fail",
//     //         message: err
//     //     })
//     // }
// })

exports.createOne = (Model) => catchAsyncErr(async (req, res, next) => {

    const newModel = await Model.create(req.body)
    res.status(201).json({
        status: "success",
        data: {
            data: newModel
        }
    })
})