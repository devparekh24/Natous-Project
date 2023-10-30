const express = require('express')
const tourController = require('./../controllers/tourController')
const authController = require('./../controllers/authController')
const reviewRouter = require('./../routes/reviewRoutes')
const router = express.Router()

// router.param('id', tourController.checkID)

//nested route
// router
//     .route('/:tourId/reviews')
//     .post(authController.protectedRoute, authController.restrictTo('user'), reviewController.createReview)
router.use('/:tourId/reviews', reviewRouter)

router
    .route('/top-5-tours')
    .get(tourController.aliasTopTours, tourController.getAllTours)

router
    .route('/tour-stats')
    .get(tourController.getTourStats)

router
    .route('/monthly-plan/:year')
    .get(authController.protectedRoute, authController.restrictTo('admin', 'lead-guide', 'guide'), tourController.getMonthlyPlan)

router
    .route('/')
    .get(tourController.getAllTours)
    .post(authController.protectedRoute, authController.restrictTo('admin', 'lead-guide'), tourController.createNewTour);

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(authController.protectedRoute, authController.restrictTo('admin', 'lead-guide'), tourController.updateTour)
    .delete(authController.protectedRoute, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

module.exports = router;