const apiRequests = require('./apiRequests');
const mongoose = require('mongoose');
const url = "mongodb://localhost:27017/hndb";
const apiRequestLogic = require('apiRequestLocic');

// Set up Port?

// Set up Database
var mongodb_url = process.env.MONGODB ? process.env.MONGODB : "mongodb://localhost:27017/greetingsDB";
mongoose.connect(mongodb_url, {keepAlive: 120, useNewUrlParser: true });mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var server = apiRequests.start(app, 6000);
