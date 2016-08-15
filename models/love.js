'use strict';

const mongoose = require('mongoose');


//ADD VALIDATION FOR YOUTUBE OR SOUNDCLOUD PLAYERID
const loveSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    songId: { type: String, required: true }
});

module.exports = mongoose.model("Love", loveSchema);