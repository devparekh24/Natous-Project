const AppError = require('./../utils/appError')
const APIFeatures = require('./../utils/apiFeatures');
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
    console.log(doc)
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
    next()
})

// exports.getTour = catchAsyncError(async (req, res, next) => {
//     // console.log(req.params)
//     // try {

//     const tour = await Tour.findById(req.params.id).populate('reviews')

//     // .populate({
//     //     path: 'guides',
//     //     select: '-__v -passwordChangedAt'
//     // })
//     // Tour.findOne({_id: req.params.id})

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

exports.getOne = (Model, populateOptions) => catchAsyncErr(async (req, res, next) => {

    let query = Model.findById(req.params.id)

    if (populateOptions) query = query.populate(populateOptions)

    const doc = await query;

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

// exports.getAllTours = catchAsyncError(async (req, res, next) => {

//     // try {

//     // console.log(req.query)
//     //1st query type
//     // const tours = await Tour.find({
//     //     duration: 5,
//     //     difficulty: 'easy'
//     // })
//     //2nd type query
//     // const tours = await Tour.find().where('duration').gt(5).where('difficulty').equals('medium');
//     // let query = await Tour.find(JSON.parse(queryStr))

//     const features = new APIFeatures(Tour.find(), req.query)
//         .filter()
//         .sort()
//         .limitfields()
//         .paginate();

//     const tours = await features.query;

//     res.status(200).json({
//         status: 'success',
//         resutls: tours.length,
//         data: {
//             tours
//         }
//     });
//     // }
//     // catch (err) {
//     //     res.status(404).json({
//     //         status: "fail",
//     //         message: err
//     //     })
//     // }

// })

exports.getAll = (Model) => catchAsyncErr(async (req, res, next) => {

    //to allow for nested GET Reiviews on tour (hack)
    let filter = {}
    if (req.params.tourId) filter = { tour: req.params.tourId }

    const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitfields()
        .paginate();

    // const doc = await features.query.explain(); // exp for indexes in DB
    const doc = await features.query;

    res.status(200).json({
        status: 'success',
        resutls: doc.length,
        data: {
            data: doc
        }
    });
})