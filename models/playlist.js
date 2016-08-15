'use strict';

const mongoose = require('mongoose');


//ADD VALIDATION FOR YOUTUBE OR SOUNDCLOUD PLAYERID
const playlistSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true }
});

module.exports = mongoose.model("Playlist", playlistSchema);