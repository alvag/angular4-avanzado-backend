'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new Schema({
    firstName: String,
    lastName: {
        type: String,
        required: [
            true,
            "El campo Apellidos es requerido"
        ]
    },
    email: {
        lowercase: true,
        type: String,
        unique: true
    },
    password: {
        select: false,
        type: String
    },
    avatar: String,
    role: {
        required: [
            true,
            "El campo Rol es requerido."
        ],
        type: String
    }
}, {
    versionKey: false
});

UserSchema.pre('save', function (next) {    
    let user = this;
    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next();
        }

        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

module.exports = mongoose.model('User', UserSchema);