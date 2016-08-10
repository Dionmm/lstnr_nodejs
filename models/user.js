'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    email: { type: String, lowercase: true, unique: true, required: true },
    password: { type: String, required: true }
});

userSchema.pre('save', function(next) {
    let user = this;

    if (user.isModified('password') || user.isNew) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

userSchema.methods.comparePassword = function(password) {
    let user = this;
    return new Promise(function(resolve, reject){
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                reject(Error(err));
            } else{
                resolve(isMatch);
            }
        });  
    });
};

module.exports = mongoose.model("User", userSchema);