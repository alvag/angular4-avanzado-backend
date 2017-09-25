'use strict';

const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('../config');

function createToken(user) {
    const payload = {
        exp: moment().add(14, 'days').unix(),
        iat: moment().unix(),
        sub: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
    };

    return jwt.encode(payload, config.SECRET_KEY);
}

function decodeToken(token) {
    const decoded = new Promise((resolve, reject) => {
        try {
            const payload = jwt.decode(token, config.SECRET_KEY);
            if (payload.exp <= moment().unix()) {
                reject({
                    message: 'El Token ha expirado',
                    status: 401
                });
            }
            resolve(payload);
        } catch (err) {
            reject({
                message: 'Invalid Token',
                status: 500
            });
        }
    });
    return decoded;
}

module.exports = {
    createToken,
    decodeToken
};