const express = require('express')
const userController = require('./../controllers/userController')
const authController = require('./../controllers/authController')
const router = express.Router()

// router
//     .route('/signup')
//     .post(authController.signup)
router.post('/signup', authController.signup)

// router
//     .route('/login')
//     .post(authController.login)
router.post('/login', authController.login)

router.post('/forgotPassword', authController.forgotPassword)
router.patch('/resetPassword/:token', authController.resetPassword)

router.patch('/updateMyPassword', authController.protectedRoute, authController.updatePassword)

router.patch('/updateMe', authController.protectedRoute, userController.updateMe)
router.delete('/deleteMe', authController.protectedRoute, userController.deleteMe)


router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createNewUser);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router