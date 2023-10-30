const express = require('express')
const reviewController = require('./../controllers/reviewController')
const authController = require('./../controllers/authController')

const router = express.Router({ mergeParams: true })

router.use(authController.protectedRoute)

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(authController.restrictTo('user'), reviewController.setTourUserId, reviewController.createReview)

router
    .route('/:id')
    .get(reviewController.getReview)
    .patch(authController.restrictTo('admin', 'user'), reviewController.updateReviews)
    .delete(authController.restrictTo('admin', 'user'), reviewController.deleteReviews)

module.exports = router;