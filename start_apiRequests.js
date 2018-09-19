const apiRequests = require('./apiRequests');
const mongoose = require('mongoose');
const url = "mongodb://localhost:27017/hndb";
var app = require("./app");

// Set up Port?

// Set up Database
var mongodb_url = process.env.MONGODB ? process.env.MONGODB : "mongodb://localhost:27017/hndb";
var mongo_username = process.env.MONGODB_USERNAME ? process.env.MONGODB_USERNAME : null;
var mongo_password = process.env.MONGODB_PASSWORD ? process.env.MONGODB_PASSWORD : null;

if (mongo_username == null || mongo_password == null) {
    mongoose.connect(mongodb_url, {keepAlive: 120, useNewUrlParser: true });
    mongoose.Promise = global.Promise;
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
}
else {
    mongoose.connect(mongodb_url, 
        {
            user: mongo_username,
            pass: mongo_password,
            keepAlive: 120,
            useNewUrlParser: true 
        });
    mongoose.Promise = global.Promise;
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
}


var server = apiRequests.createApiReader(app, 6000);
