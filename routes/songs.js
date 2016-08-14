'use strict';

const express = require('express');
const bodyParser = require("body-parser");

const youtube = require('../helpers/youtube');
const spotify = require('../helpers/spotify');
const secret = require('../config/main').secret;
const Song = require("../models/song");

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

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

router.post('/play', (req, res) => {
	let player = req.body.player;
	let playerId = req.body.playerId;

	Song.findOne({ playerId: playerId }, function(err, song){
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

router.put('/love', (req, res) => {
	let songId = req.body.songId;

	Song.findOne({ _id: songId }, function(err, song){
		if(err){
			return res.status(500).json({err: err});
		} else if(!song){
			res.json({message: 'songId not found'});
		} else {
			song.loves = song.loves + 1;
			song.save().then(res.json({message: 'Song loves updated', songId: song.id}));
		}
	});
});

module.exports = router;