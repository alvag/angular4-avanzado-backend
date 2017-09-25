'use strict';

const User = require('../models/user');
const Animal = require('../models/animal');
const fs = require('fs');
const Response = require('../helpers/response_helper');
const errHelper = require('../helpers/errors_helper');

function saveAnimal(req, res) {
	const animal = new Animal({
		name: req.body.name,
		description: req.body.description,
		year: req.body.year,
		image: null,
		user: req.user.sub
	});

	animal.save((err, animalStored) => {
		if (err) {
			Response.errorResponse(res, errHelper.getErrors(err), 'Error al registrar el animal', Response.BAD_REQUEST);
		} else if (animalStored) {
			Response.successResponse(res, animalStored, 'Datos registrados', Response.CREATED);
		} else {
			Response.errorResponse(res, undefined, 'Error al guardar los datos');
		}
	});
}

function getAll(req, res) {
	Animal.find({}).populate({ path: 'user' }).exec((err, animals) => {
		if (err) {
			Response.errorResponse(res, err);
		} else if (animals.length > 0) {
			Response.successResponse(res, animals);
		} else {
			Response.errorResponse(res, undefined, 'No existen animales registrados', Response.NOT_FOUND);
		}
	});
}

function getOne(req, res) {
	let animalId = req.params.animalId;
	Animal.findById(animalId).populate({ path: 'user' }).exec((err, animal) => {
		if (err) {
			Response.errorResponse(res, err);
		} else if (animal) {
			Response.successResponse(res, animal);
		} else {
			Response.errorResponse(res, undefined, 'El animal no existe', Response.NOT_FOUND);
		}
	});
}

function update(req, res) {
	let animalId = req.params.animalId;
	Animal.findByIdAndUpdate(animalId, req.body, { new: true }, (err, animalUpdated) => {
		if (err) {
			Response.errorResponse(res, err, 'Error al actualizar', Response.INTERNAL_SERVER_ERROR);
		} else if (animalUpdated) {
			Response.successResponse(res, animalUpdated);
		} else {
			return Response.errorResponse(res, undefined, 'El animal no existe', Response.NOT_FOUND);
		}
	});
}

function uploadImage(req, res) {
	let animalId = req.params.animalId;
	if (req.files) {
		const filePath = req.files.image.path;
		const fileSplit = filePath.split('/');
		const fileName = fileSplit[2];
		let fileExt = fileName.split('.')[1];

		if (fileExt === 'png' || fileExt === 'jpg' || fileExt === 'jpeg' || fileExt === 'gif') {
			Animal.findByIdAndUpdate(animalId, { image: fileName }, { new: true }, (err, animalUpdated) => {
				if (err) {
					Response.errorResponse(res, err, 'Error al actualizar', Response.INTERNAL_SERVER_ERROR);
				} else if (animalUpdated) {
					Response.successResponse(res, animalUpdated);
				} else {
					Response.errorResponse(res, undefined, 'El animal no existe', Response.NOT_FOUND);
				}
			});
		} else {
			fs.unlink(filePath, (err) => {
				if (err) {
					Response.errorResponse(res, err, 'No es un tipo de archivo permitido.', Response.BAD_REQUEST);
				} else {
					Response.errorResponse(res, undefined, 'No es un tipo de archivo permitido.', Response.BAD_REQUEST);
				}
			});
		}
	} else {
		Response.errorResponse(res, undefined, 'No se ha subido ningún archivo');
	}
}

function deleteAnimal(req, res) {
	let animalId = req.params.animalId;
	Animal.findByIdAndRemove(animalId, (err, animalRemoved) => {
		if (err) {
			Response.errorResponse(res, err, 'Error en la petición');
		} else if (animalRemoved) {
			Response.successResponse(res, animalUpdated, 'Datos borrados');
		} else {
			return Response.errorResponse(res, undefined, 'El animal no existe', Response.NOT_FOUND);
		}
	});
}


module.exports = {
	saveAnimal,
	getAll,
	getOne,
	update,
	uploadImage,
	deleteAnimal
};