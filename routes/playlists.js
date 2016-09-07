'use strict';

const express = require('express');
const bodyParser = require("body-parser");
const passport = require('passport');

const secret = require('../config/main').secret;
const Playlist = require("../models/playlist");
const SongInPlaylist = require("../models/songInPlaylist");

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//Initialise passport for authentication
router.use(passport.initialize());
require('../config/passport')(passport);


//Search for the queried song through youtube/spotify
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) =>{
	let userId = req.user._id;

	Playlist.find({userId: userId})
	.then(data => { //data contains an array of playlist objects including the playlist ID
		
		//Iterates through the playlists returned in 'data' and then iterates through each playlist to find
		//all the songs the belong to that playlist id
		//Returns an array of playlist objects containing the songs
		playlistLookup(data).then(msg => {
			res.json({msg})
		});
	})
	.catch( err => {
		res.json({err: err + ''});
	});
});

//Add new playlist
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) =>{
	//Takes in user id, playlist name and an array of songs
	//Saves the playlist in the Playlist collection with name and user id, then
	//takes the generated playlist id and uses it to save the 
	//songs to SongsInPlaylist collection.
	let userId = req.user._id;
	let name = req.body.name;
	let newPlaylist = new Playlist({
		userId: userId,
		name: name
	});
	let songs = Array.prototype.slice.call(req.body.songs);

	newPlaylist.save() //Save the playlist
	.then(() => {
		//Take the generated playlist id and use it to save the songs to SongsInPlaylist collection
		let songsPromises = songs.map(songId => addSong(newPlaylist._id, songId));

		//Wait for all promises to be resolved before responding
		Promise.all(songsPromises).then( msg => {
			res.json({message: msg});
		});
	})
	.catch( err => res.json({err: err}) );
});

router.put('/:playlistId', (req, res) =>{
	res.status(501);
});

router.delete('/:playlistId', (req, res) =>{
	res.status(501);
});

//Takes playlist id and a song id then save to SongsInPlaylist collection
function addSong(playlistId, songId){
	return new Promise((resolve, reject) => {
		let newSongInPlaylist = new SongInPlaylist({
			playlistId: playlistId,
			songId: songId
		});

		newSongInPlaylist.save()
		.then(() =>{
			resolve('success');
		})
		.catch(err =>{
			reject(err);
		})
	});
}

//Takes an array of playlists and returns formatted array of objects with
//all the songs belonging to each playlist
function playlistLookup(playlistsArray){
	return new Promise((resolve, reject) => {
		var songsArray = []; //Used to hold each playlist containing the songs once returned

		function iterate(index){
			console.log('iterating ' + index)
			if(index === playlistsArray.length){
				return resolve(songsArray);
			}
			let playlist = playlistsArray[index];

			//songLookup returns an array with all the songs belonging to the input playlist
			songLookup(playlist).then(songs => {
				//Format the results, adding in the playlist id and name
				let playlistObject = {
					id: playlist._id,
					name: playlist.name,
					songs: songs
				};
				songsArray.push(playlistObject);
				iterate(index + 1);
			});
		}

		iterate(0);

	});
}

//Takes an playlist object and returns an array of all the songs belonging to that playlist
function songLookup(playlistObject){
	return new Promise((resolve, reject) => {
		//Find all songs with the playlist id specified
		SongInPlaylist.find({playlistId: playlistObject._id})
		.then(data =>{
			let songArray = []
			function iterate(index){
				console.log('iterating songs ' + index)
				if(index === data.length){
					return resolve(songArray);
				}
				songArray.push(data[index].songId);
				iterate(index + 1);
			}

			iterate(0);
		});
	});
}
module.exports = router;