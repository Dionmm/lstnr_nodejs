'use strict';

const express = require('express');
const bodyParser = require("body-parser");
const passport = require('passport');

const youtube = require('../helpers/youtube');
const spotify = require('../helpers/spotify');
const secret = require('../config/main').secret;
const Song = require("../models/song");
const Love = require("../models/love");

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//Initialise passport for authentication
router.use(passport.initialize());
require('../config/passport')(passport);


//Search for the queried song through youtube/spotify
router.post('/search/youtube', (req, res) =>{
	let q = req.body.q || req.query.q;

	youtube.search(q).then(data => {
		res.json(data);
	}, err => {
		res.json(err);
	});
});

router.post('/search/spotify', (req, res) =>{
	let q = req.body.q || req.query.q;

	spotify.search(q).then(data => {
		res.json(data);
	}, err => {
		res.json(err);
	});
});

router.post('/play', passport.authenticate('jwt', {session: false}) , (req, res) => {
	let player = req.body.player;
	let playerId = req.body.playerId;

	Song.findOne({ playerId: playerId }, (err, song) => {
		if(err){
			return res.status(500).json({err: err});
		} else if(!song){
			let newSong = new Song({
				player: player,
				playerId: playerId
			});
			newSong.save((err, songId) =>{
				if (err){
					return res.json({err: err, message: 'An error occurred'});
				} else{
					return res.json({message: 'New song saved', songId: songId.id});
				}
			});
		} else {
			song.playCount = song.playCount + 1;
			song.save().then(res.json({message: 'Play count updated', songId: song.id}));
		}
	});
});

router.post('/love', passport.authenticate('jwt', {session: false}), (req, res) => {
	let songId = req.body.songId;
	let userId = req.user._id;

	Love.findOneAndRemove({ userId: userId, songId: songId }, function(err, result){
		if(err){
			return res.status(500).json({err: err});
		} else if(!result){
			Song.findOne({_id: songId}, function(err, song){
				if (err){
					return res.status(500).json({err: err})
				} else if(!song){
					res.json({message: 'Song not found'});
				} else{
					let newLove = new Love({
						userId: userId,
						songId: songId
					});
					newLove.save().then(res.json({message: 'Song love added', songId: song.id}));
				}
			});
		} else {
			res.json({message: 'Love removed'});
		}
	});
});

module.exports = router;