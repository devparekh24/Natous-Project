const catchAsyncErr = require('../utils/catchAsyncErr');
const Tour = require('./../model/tourModel')

exports.getOverview = catchAsyncErr(async (req, res, next) => {

    //1.get tour data from collection
    const tours = await Tour.find()

    //2.Build template
    //3.render that template using tour data from 1.
    res.status(200).render('overview', {
        title: 'All Tours',
        tours
    });
})

exports.getTour = catchAsyncErr(async (req, res, next) => {

    //1.get the data for requested tour including reviews and guides
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user'
    })
    //2. buide template
    //3.render that template using tour data from 1.

    res.status(200).render('tour', {
        title: tour.name,
        tour
    });
    next()
})

exports.getLogin = catchAsyncErr(async (req, res, next) => {

    // //1.get the data for requested tour including reviews and guides
    // const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    //     path: 'reviews',
    //     fields: 'review rating user'
    // })
    // //2. buide template
    // //3.render that template using tour data from 1.

    res.status(200).render('login', {
        title: 'Login'
    });
})

exports.getSignup = catchAsyncErr(async (req, res, next) => {

    // //1.get the data for requested tour including reviews and guides
    // const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    //     path: 'reviews',
    //     fields: 'review rating user'
    // })
    // //2. buide template
    // //3.render that template using tour data from 1.

    res.status(200).render('signup', {
        title: 'SignUp',
    });
})