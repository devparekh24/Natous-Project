const mongoose = require('mongoose')
const dontenv = require('dotenv')
const fs = require('fs')
const Tour = require('./../../model/tourModel')

dontenv.config({ path: './config.env' })

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
    .connect(DB)
    .then(() => // console.log(con.connections)
        console.log('DataBase Connected Successfully...')
    );

//reading json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'))

//import data into collection 
const importData = async () => {
    try {
        await Tour.create(tours)
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