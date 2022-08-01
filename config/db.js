const mongoose = require('mongoose');
require('dotenv').config();

function connectDb() {

    // database connection
    mongoose.connect(process.env.MONGO_CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true})
    .then( () =>{
        console.log('successfully connected');
    })
    .catch((error) =>{
        console.log('cannot connect to database, ${error}');
    });
}

//0YlIzQcfzZgFAiC1


module.exports = connectDb;



   // const connection = mongoose.connection;

    // connection.once('open' ,()=> {
    //     console.log('database connected');
    // })
    // connection.catch(err => {
    //     console.log('connection failed.');
    // });