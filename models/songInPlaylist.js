'use strict';

const mongoose = require('mongoose');


//ADD VALIDATION FOR YOUTUBE OR SOUNDCLOUD PLAYERID
const songInPlaylistSchema = new mongoose.Schema({
    playlistId: { type: String, required: true },
    songId: { type: String, required: true }
});

module.exports = mongoose.model("SongInPlaylist", songInPlaylistSchema);