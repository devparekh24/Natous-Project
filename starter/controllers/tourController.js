const AppError = require('../utils/appError')
const Tour = require('./../model/tourModel')
const catchAsyncError = require('./../utils/catchAsyncErr')
const factory = require('./handlerFactory')

// static data
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

// exports.checkID = (req, res, next, val) => {

//     if (req.params.id * 1 > tours.length) {
//         console.log(`ID is: ${val}`)
//         return res.status(404).json({
//             status: "fail",
//             message: 'Invalid ID'
//         })
//     }
//     next()
// }

// exports.checkBody = (req, res, next) => {

//     if (!req.body.name || !req.body.price) {

//         return res.status(404).json({
//             status: "fail",
//             message: 'name or price missing'
//         })
//     }
//     next()
// }

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

exports.getAllTours = factory.getAll(Tour)

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,duration,price,ratingAverage,summary,difficulty'
    next();
}

// exports.createNewTour = async (req, res) => {

//     // const newId = tours[tours.length - 1].id + 1;
//     // const newTour = Object.assign({
//     //     id: newId
//     // }, req.body);

//     // tours.push(newTour);

//     // fs.writeFile('./dev-data/data/tours-simple.json', JSON.stringify(tours), err => {
//     // })

//     //simple way to creating a document from model -1st type
//     // const newTour = new Tour({})
//     // newTour.save();

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

exports.createNewTour = factory.createOne(Tour)

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

exports.getTour = factory.getOne(Tour, { path: 'reviews' })

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

exports.updateTour = factory.updateOne(Tour)

// exports.deleteTour = catchAsyncError(async (req, res, next) => {
//     // try {
//     const tour = await Tour.findByIdAndDelete(req.params.id)
//     if (!tour) {
//         return next(new AppError('No tour found with that ID', 404))
//     }

//     res.status(204).json({
//         status: 'success',
//         data: null
//     })
//     // }
//     // catch (err) {
//     //     res.status(404).json({
//     //         status: "fail",
//     //         message: err
//     //     })
//     // }
// })

exports.deleteTour = factory.deleteOne(Tour)

exports.getTourStats = catchAsyncError(async (req, res, next) => {
    // try {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$startingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            }
        },
        {
            $sort: {
                avgPrice: 1
            }
        }
    ]);
    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    })
    // }
    // catch (err) {
    //     res.status(404).json({
    //         status: "fail",
    //         message: err
    //     })
    // }
})

exports.getMonthlyPlan = catchAsyncError(async (req, res, next) => {
    // try {

    const year = req.params.year * 1
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
            // : { '$year': year } 
        }, {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' }
            }
        },
        {
            $addFields: {
                month: '$_id'
            }
        }, {
            $project: {
                _id: 0
            }
        },
        {
            $sort: { numTourStarts: -1 }
        },
        {
            $limit: 5
        }
    ])

    res.status(200).json({
        status: 'success',
        length: plan.length,
        data: {
            plan
        }
    });

    // } catch (err) {
    //     res.status(404).json({
    //         status: "fail",
    //         message: err
    //     })
    // }
})

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/250/center/-40.1654,20.1654/unit/km

exports.getTourWithin = catchAsyncError(async (req, res, next) => {

    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',')
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1
    if (!lat || !lng) {
        next(new AppError('please provide latitude and longitude in the formate lat,lng!', 400))
    }

    // console.log(distance, lat, lng, unit)
    const tour = await Tour.find({ startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } } })

    res.status(200).json({
        status: "success",
        results: tour.length,
        data: {
            data: tour
        }
    })
})

// /distance/:latlng/unit/:unit
exports.getDistances = catchAsyncError(async (req, res, next) => {

    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',')

    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

    if (!lat || !lng) {
        next(new AppError('please provide latitude and longitude in the formate lat,lng!', 400))
    }

    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1]
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier
            }
        }, {
            $project: {
                distance: 1,
                name: 1
            }
        }
    ])

    res.status(200).json({
        status: "success",
        results: distances.length,
        data: {
            data: distances
        }
    })
})