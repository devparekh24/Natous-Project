const mongoose = require('mongoose')
const dontenv = require('dotenv')
const fs = require('fs')
const Tour = require('./../../model/tourModel')
const User = require('./../../model/usermodel')
const Review = require('./../../model/reviewModel')

dontenv.config({ path: './config.env' })

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
    .connect(DB)
    .then(() => // console.log(con.connections)
        console.log('DataBase Connected Successfully...')
    );

//reading json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'))
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'))


//import data into collection 
const importData = async () => {
    try {
        await Tour.create(tours)
        await User.create(users, { validateBeforeSave: false })
        await Review.create(reviews)
        console.log('Data successfully loaded...')
        process.exit()
    } catch (err) {
        console.log(err)
    }
}

//deleting data from db
const deleteData = async () => {
    try {
        await Tour.deleteMany()
        await User.deleteMany()
        await Review.deleteMany()
        console.log('Data successfully deleted...')
        process.exit()
    } catch (err) {
        console.log(err)
    }
}

console.log(process.argv)

if (process.argv[2] === '--import') {
    importData()
} else if (process.argv[2] === '--delete') {
    deleteData()
}