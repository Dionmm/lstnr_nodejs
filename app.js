﻿'use strict';

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const mongoose = require('mongoose');

const config = require('./config/main');
const routes = require('./routes/index');
const users = require('./routes/users');
const songs = require('./routes/songs');
const playlists = require('./routes/playlists');
const youtube = require('./helpers/youtube');

const app = express();
const dbString = config.database;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

//Connect to Database
mongoose.connect(dbString);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function(){
    console.log("We're in boss");
});

//Set Youtube API Key
youtube.APIKey = 'AIzaSyBWaFgKjAgeblkrWqWKPKeaKAhdbZvQTkE';

app.use('/', routes);
app.use('/api/users', users);
app.use('/api/songs', songs);
app.use('/api/playlists', playlists);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(3700, function () {
    console.log('App listening on port 3700!');
});

module.exports = app;
