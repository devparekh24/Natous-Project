const catchAsyncErr = require('../utils/catchAsyncErr');
const Review = require('./../model/reviewModel');
const factory = require('./handlerFactory')

exports.getAllReviews = catchAsyncErr(async (req, res, next) => {

    let filter = {}
    if (req.params.tourId) filter = { tour: req.params.tourId }

    const reviews = await Review.find(filter)
    res.status(200).json({
        status: "success",
        results: reviews.length,
        data: {
            reviews
        }
    })
    next()
})

// exports.createReview = catchAsyncErr(async (req, res, next) => {

//     // allowed nested routes
//     if (!req.body.tour) req.body.tour = req.params.tourId
//     if (!req.body.user) req.body.user = req.user.id

//     const newReview = await Review.create(req.body)
//     res.status(201).json({
//         status: "success",
//         data: {
//             review: newReview
//         }
//     })
//     next()
// })

exports.setTourUserId = (req, res, next) => {

    // allowed nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId
    if (!req.body.user) req.body.user = req.user.id

    next()
}

exports.createReview = factory.createOne(Review)

exports.updateReviews = factory.updateOne(Review)

exports.deleteReviews = factory.deleteOne(Review)
