'use strict';

module.exports = {
	SECRET_KEY: 'miclavedetokens',
	db: process.env.MONGODB || 'mongodb://localhost:27017/zoo',
	port: process.env.PORT || 3000
};