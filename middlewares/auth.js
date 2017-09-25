'use strict';

const Response = require('../helpers/response_helper');
const jwt = require('../helpers/jwt_helper');

function isAuth(req, res, next) {
    if (!req.headers.authorization) {
        return Response.errorResponse(res, undefined, 'No tienes autorización', Response.FORBIDDEN);
    }
    const token = req.headers.authorization.split(" ")[1];

    jwt.decodeToken(token).then(response => {
        req.user = response;
        next();
    }).catch(response => {
        Response.errorResponse(res, undefined, response.message, Response.UNAUTHORIZED);
    });
}

function isAdmin(req, res, next) {
    if (!req.headers.authorization) {
        return Response.errorResponse(res, undefined, 'No tienes autorización', Response.FORBIDDEN);
    }
    const token = req.headers.authorization.split(" ")[1];
    jwt.decodeToken(token).then(response => {
        req.user = response;
        if (response.role === 'admin') {
            return next();
        }
        return Response.errorResponse(res, undefined, 'No tienes autorización', Response.FORBIDDEN);

    }).catch(response => {
        Response.errorResponse(res, undefined, response.message, Response.UNAUTHORIZED);
    });
}

module.exports = { isAuth, isAdmin };