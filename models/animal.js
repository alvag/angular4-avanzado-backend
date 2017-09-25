'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnimalSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    year: Number,
    image: String,
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Animal', AnimalSchema);