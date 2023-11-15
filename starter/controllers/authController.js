const crypto = require('crypto')
const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const catchAsyncErr = require('../utils/catchAsyncErr')
const User = require('./../model/usermodel')
const AppError = require('../utils/appError')
const sendEmail = require('../utils/email')

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRETKEY, { expiresIn: process.env.JWT_EXP_TIME })
}
const createSendToken = (user, statusCode, res) => {

    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXP_TIME * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions)

    user.password = undefined

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}
exports.signup = catchAsyncErr(async (req, res, next) => {

    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        role: req.body.role,
    })

    // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRETKEY, { expiresIn: process.env.JWT_EXP_TIME })
    // const token = signToken(newUser._id);

    // res.status(201).json({
    //     status: 'success',
    //     token,
    //     data: {
    //         user: newUser
    //     }
    // })
    createSendToken(newUser, 201, res);
    next()
})

exports.login = catchAsyncErr(async (req, res, next) => {
    // const email = req.body.email;
    // const password = req.body.password;

    const { email, password } = req.body;

    //check the exsistence of email and password
    if (!email || !password) {
        return next(new AppError('Email & Password is indeed!', 400))
    }

    //user exsist && password is correct
    const user = await User.findOne({ email }).select('+password')
    // console.log(user)
    // const correct = await user.correctPassword(password, user.password)

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401))
    }

    //everything is good => send token to the client 
    // const token = signToken(user._id)

    // res.status(200).json({
    //     status: "success",
    //     token
    // })
    createSendToken(user, 200, res);

})

exports.protectedRoute = catchAsyncErr(async (req, res, next) => {
    let token;

    //checking the token 
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    else if (req.cookies.jwt) {
        token = req.cookies.jwt
    }
    console.log(token)
    if (!token) {
        return next(new AppError('You aren\'t logged in!, Please login to get access', 401))
    }

    //verification of token 
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRETKEY)
    // console.log(decode)

    //checking the existance of the user
    const currentUser = await User.findById(decode.id)
    if (!currentUser) {
        return next(new AppError('User doesn\'t exist belonging to this token!', 401))
    }

    //check if user changed password after the token(JWT) was issued
    if (currentUser.changedPasswordAfter(decode.iat)) {
        return next(new AppError('User recently changed password, please login again!', 401))
    }

    req.user = currentUser;
    next() //access granted to the protected route
})

//only for render pages
exports.isLoggedIn = catchAsyncErr(async (req, res, next) => {

    console.log(req.cookies)
    if (req.cookies.jwt) {
        // try {

        //verify the token 
        const decode = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETKEY)

        //checking the existance of the user
        const currentUser = await User.findById(decode.id)
        if (!currentUser) {
            return next()
        }

        //check if user changed password after the token(JWT) was issued
        if (currentUser.changedPasswordAfter(decode.iat)) {
            return next()
        }

        //there is a logged in user
        res.locals.user = currentUser
        return next() //access granted to the logged in user
        // } catch (err) {
        //     return next()
        // }
    }
    next();
})

// exports.logout = (req, res) => {
//     res.cookie('jwt', 'logout', {
//         expires: new Date(Date.now() + 10 * 1000),
//         httpOnly: true
//     })
//     res.status(200).json({
//         status: 'success'
//     })
// }

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        //roles = ['admin', 'lead-guide'] but here role = 'user'
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You don\'t have permission to perform this action!', 403))
        }
        next();
    }
}

exports.forgotPassword = catchAsyncErr(async (req, res, next) => {

    //get user based on posted email
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(new AppError('User not found with this email!', 404))
    }

    //generate random reset token 
    const resetToken = user.resetTokenForCreatePassword()
    await user.save({ validateBeforeSave: false })

    //send to the user email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and confirmPassword to: ${resetURL}.\n If you didn't forget your password, please ignore this email!`;

    try {

        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (its valid for only 10 min)',
            message
        })

        res.status(200).json({
            status: 'success',
            message: 'Token sent to the email!'
        })
    }
    catch (err) {
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save({ validateBeforeSave: false })

        return next(new AppError('There was an error sending the email. Try Again Later!', 500))
    }

})

exports.resetPassword = catchAsyncErr(async (req, res, next) => {

    //1. Get user based on the token 
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } })

    //2. Token isn't expire && user is there then==> set new password
    if (!user) {
        return next(new AppError('Token is Invalid or has Expired!', 400))
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save()

    //3.Update changedPasswordAt Property for user
    user.passwordChangedAt = Date.now()

    //4. log the user in, send JWT 
    // const token = signToken(user._id)

    // res.status(200).json({
    //     status: "success",
    //     token
    // })
    createSendToken(user, 200, res);
    next()
})

exports.updatePassword = catchAsyncErr(async (req, res, next) => {
    //1. get user from collection
    const user = await User.findById(req.user.id).select('+password')

    //2. check if posted currentpassword is correct 
    if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
        return next(new AppError('Your current Password is Wrong!', 401))
    }

    //3. if so then update password
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();

    //4. log user in, send JWT
    // const token = signToken(user._id)

    // res.status(200).json({
    //     status: "success",
    //     token
    // })
    createSendToken(user, 200, res);
    next()
})