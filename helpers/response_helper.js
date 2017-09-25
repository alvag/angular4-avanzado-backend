'use strict';
// https://es.wikipedia.org/wiki/Anexo:C%C3%B3digos_de_estado_HTTP

function successResponse(res, data = undefined, message = undefined, code = this.OK) {
    return res.status(code).send({
        code,
        data,
        message
    });
}

function errorResponse(res, error = undefined, message = 'Error en la petición', code = this.INTERNAL_SERVER_ERROR) {    
    return res.status(code).send({
        code,
        error,
        message
    });
}

module.exports = {
    errorResponse,
    successResponse,
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
};