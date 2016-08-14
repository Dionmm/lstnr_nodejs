'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


//ADD VALIDATION FOR YOUTUBE OR SOUNDCLOUD PLAYERID
const songSchema = new mongoose.Schema({
    player: { type: String, enum: ['youtube', 'spotify'], lowercase: true, required: true },
    playerId: { type: String, required: true },
    playCount: {type: Number, default: 1},
    firstPlay: {type: Date, default: Date.now},
    loves: { type: Number, default: 0}
});

module.exports = mongoose.model("Song", songSchema);