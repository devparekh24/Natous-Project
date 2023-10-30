const mongoose = require('mongoose')
const dontenv = require('dotenv')

dontenv.config({ path: './config.env' })
const app = require('./app')
// var mongoose = require('mongoose');
// //Set up default mongoose connection
// var mongoDB = 'mongodb://127.0.0.1/my_database';
// mongoose.connect(mongoDB, { useNewUrlParser: true });
//  //Get the default connection
// var db = mongoose.connection;
// //Bind connection to error event (to get notification of connection errors)
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// console.log(process.env)

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
    .connect(DB,
        // {
        //     useNewUrlParser: true,
        //     useCreateIndex: true,
        //     useFindAndModify: false
        // }
    )
    .then(() => // console.log(con.connections)
        console.log('DataBase Connected Successfully...')
    )
// .catch(err => console.log('ERROR!!!', err));


//creating a document for a model (tour model)
// const testTour = new Tour({
//     name: 'The Forest Hiker',
//     rating: 4.7,
// });

// // testTour
// //     .save()
// //     .then(doc => {
// //         console.log(doc)
// //     })
// //     .catch(err => console.log('Error!', err))

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port : ${port}...`)
})

// process.on('unhandledRejection',err=>{
//     console.log(err.name,'---',err.message)
// })
// process.on('uncaughtException',err=>{
//     console.log(err.name,'---',err.message)
// })