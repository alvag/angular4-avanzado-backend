'use strict';

function getErrors(error) {
    if (error.name === 'ValidationError') {
        let err = {};
        for (let item in error.errors) {
            err[item] = error.errors[item].message;
        }
        return err;
    }
    return error;
}

module.exports = {
    getErrors
};