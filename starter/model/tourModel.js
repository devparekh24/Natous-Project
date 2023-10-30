const mongoose = require('mongoose')
const slugify = require('slugify')
// const validator = require('validator')
// const User = require('./usermodel')

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a Group Size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either : easy, medium or difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, "Rating must be above 1.0"],
        max: [5, "Rating must be below 5.0"]
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a summary']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },
    startLocation: {
        //geo json 
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
        //child referencing
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

//virtual properties
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
})

//virtual populate
tourSchema.virtual('reviews',{
    ref: 'Review',
    foreignField: 'tour',
    localField:'_id'
})

//document middleware always run before .save() & .create()
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true })
    next();
})

//embedding guides into tour model - where, guides: Array
// tourSchema.pre('save', async function (next) {
//     const guidesPromises = this.guides.map(async id => await User.findById(id))
//     this.guides = await Promise.all(guidesPromises)
//     next();
// })

// tourSchema.pre('save', function (next) {
//     console.log('Saving the document...')
//     next();
// })

// tourSchema.post('save', function (doc,next) {
//     console.log(doc)
//     next();
// })

//query middleware

tourSchema.pre(/^find/, function (next) {
    this.start = Date.now()
    this.find({
        secretTour: { $ne: true }
    })
    next();
})
tourSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt'
    });
    next();
})

tourSchema.post(/^find/, function (doc, next) {
    console.log(`Query took ${Date.now() - this.start} millisecond...`)
    // console.log(doc)
    next();
})

//aggregation middleware
tourSchema.pre('aggregate', function (next) {
    // console.log(this)
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
    console.log(this.pipeline())
    next()
})

//creating a model (tour model) from tour schema
const Tour = mongoose.model('Tour', tourSchema)
module.exports = Tour;