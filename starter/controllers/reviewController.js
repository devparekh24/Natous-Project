const Review = require('./../model/reviewModel');
const factory = require('./handlerFactory')
// const catchAsyncErr = require('../utils/catchAsyncErr');

exports.getAllReviews = factory.getAll(Review)

exports.setTourUserId = (req, res, next) => {

    // allowed nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId
    if (!req.body.user) req.body.user = req.user.id
    next()
}

exports.createReview = factory.createOne(Review)

exports.updateReviews = factory.updateOne(Review)

exports.getReview = factory.getOne(Review)

exports.deleteReviews = factory.deleteOne(Review)