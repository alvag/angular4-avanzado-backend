'use strict';

const express = require( 'express' );
const app = express();
const bodyParser = require( 'body-parser' );
const api = require( './routes/router' );

app.use( bodyParser.urlencoded( {
	extended: false
} ) );
app.use( bodyParser.json() );

// Configurar cabeceras y cors
app.use( ( req, res, next ) => {
	res.header( 'Access-Control-Allow-Origin', '*' );
	res.header( 'Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method' );
	res.header( 'Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE' );
	res.header( 'Allow', 'GET, POST, OPTIONS, PUT, DELETE' );
	next();
} );
// ruta base
app.use( '/api', api );

module.exports = app;