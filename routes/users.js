'use strict';

const express = require('express');
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const secret = require('../config/main').secret;
const User = require("../models/user");

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

router.use(passport.initialize());
require('../config/passport')(passport);

router.get('/', (req, res) => {
    res.json({ success: true });
});

router.post('/register', (req, res) => {
    if (!req.body.email || !req.body.password){
        res.json({message: 'No email or password'});
    } else{
    	let newUser = new User({
    		email: req.body.email,
    		password: req.body.password
    	});

    	newUser.save(err => {
    		if (err){
    			return res.json({err: err, message: 'Email address already exists'});
    		} else{
    			res.json({message: 'New user created'});
    		}
    	});
    }
});

router.post('/auth', (req, res) => {
	User.findOne({email: req.body.email}, function(err, user){
		if(err){
			return res.status(500).json({err: err});
		} else if(!user){
			res.json({message: 'User not found'});
		} else {
			user.comparePassword(req.body.password).then(function(isMatch){
				if(isMatch){
					var token = jwt.sign({id: user.id}, secret, {expiresIn: "24h"});
					res.json({token: 'JWT ' + token});
				} else{
					res.json({message: "Password doesn't match"});
				}
			}, function(err){
				console.log(err);
				res.status(500).json({message: 'An error occured'});
			});
		}
	});
});

module.exports = router;