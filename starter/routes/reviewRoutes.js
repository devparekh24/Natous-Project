const express = require('express')
const reviewController = require('./../controllers/reviewController')
const authController = require('./../controllers/authController')

const router = express.Router({ mergeParams: true })

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(authController.protectedRoute, authController.restrictTo('user'), reviewController.setTourUserId, reviewController.createReview)

router
    .route('/:id')
    .patch(reviewController.updateReviews)
    .delete(authController.protectedRoute, authController.restrictTo('admin', 'lead-guide'), reviewController.deleteReviews)

module.exports = router;