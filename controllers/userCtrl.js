'use strict';

const User = require('../models/user');
const jwt = require('../helpers/jwt_helper');
const bcrypt = require('bcrypt-nodejs');
const fs = require('fs');
const path = require('path');
const Response = require('../helpers/response_helper');
const errHelper = require('../helpers/errors_helper');


function signUp(req, res) {
	const user = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email.toLowerCase(),
		password: req.body.password,
		role: req.body.role
	});

	User.findOne({
		email: user.email.toLowerCase()
	}, (err, userFound) => {
		if (err) {
			return Response.errorResponse(res, err);
		} else if (userFound) {
			return Response.errorResponse(res, undefined, 'Ya existe un usuario registrado con ese correo', Response.CONFLICT);
		}
		user.save((err) => {
			if (err) {
				return Response.errorResponse(res, errHelper.getErrors(err), 'Error al registrar el usuario', Response.BAD_REQUEST);
			}
			return Response.successResponse(res, undefined, 'Te has registrado correctamente', Response.CREATED);
		});
	});
}

function signIn(req, res) {
	User.findOne({
		email: req.body.email.toLowerCase()
	}, (err, user) => {
		if (err) {
			return Response.errorResponse(res, err);
		} else if (!user) {
			return Response.errorResponse(res, undefined, 'No existe ningún usuario con ese correo', Response.NOT_FOUND);
		}

		bcrypt.compare(req.body.password, user.password, (err, check) => {
			if (err) {
				return Response.errorResponse(res, err, 'Error al iniciar sesión', Response.BAD_REQUEST);
			} else if (!check) {
				return Response.errorResponse(res, undefined, 'Contraseña incorrecta', Response.BAD_REQUEST);
			}

			user.password = undefined;

			let token = jwt.createToken(user);
			return Response.successResponse(res, {
				user,
				token
			}, 'Te has logueado correctamente', Response.OK);
		});

	}).select('+password');
}

function update(req, res) {
	let userId = req.params.userId;

	if (req.body.password) {
		req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
	}

	if (req.user.sub === userId || req.user.role === 'admin') {
		User.findByIdAndUpdate(userId, req.body, {
			new: true
		}, (err, userUpdated) => {
			if (err) {
				return Response.errorResponse(res, err, 'Error al actualizar', Response.INTERNAL_SERVER_ERROR);
			} else if (userUpdated) {
				let token = jwt.createToken(userUpdated);
				return Response.successResponse(res, {
					user: userUpdated,
					token
				});
			}
			return Response.errorResponse(res, undefined, 'No existe el usuario', Response.NOT_FOUND);
		});
	} else {
		return Response.errorResponse(res, undefined, 'No tienes autorización', Response.FORBIDDEN);
	}
}

function deleteOldImage(filePath) {
	fs.unlink(filePath, (err) => {
		if (err) {
			return {
				error: true,
				message: err
			};
		}
		return 'success';
	});
}

function uploadAvatar(req, res) {
	let userId = req.params.userId;
	if (req.files) {
		const filePath = req.files.avatar.path;
		const fileSplit = filePath.split('/');
		const fileName = fileSplit[2];
		let fileExt = fileName.split('.')[1];

		if (fileExt === 'png' || fileExt === 'jpg' || fileExt === 'jpeg' || fileExt === 'gif') {
			if (req.user.sub === userId || req.user.role === 'admin') {
				User.findByIdAndUpdate(userId, {
					avatar: fileName
				}, {
					new: true
				}, (err, userUpdated) => {
					if (err) {
						return Response.errorResponse(res, err, 'Error al actualizar', Response.INTERNAL_SERVER_ERROR);
					} else if (userUpdated) {
						if (req.body.oldImage !== fileName) {
							let oldImagePath = `./uploads/users/${req.body.oldImage}`;
							deleteOldImage(oldImagePath);
						}

						return Response.successResponse(res, userUpdated);
					}
					return Response.errorResponse(res, undefined, 'No existe el usuario', Response.NOT_FOUND);
				});
			} else {
				return Response.errorResponse(res, undefined, 'No tienes autorización', Response.FORBIDDEN);
			}
		} else {
			let deleteAvatar = deleteOldImage(filePath);
			if (deleteAvatar.err) {
				return Response.errorResponse(res, deleteAvatar.err, 'No es un tipo de archivo permitido.', Response.BAD_REQUEST);
			}
			return Response.errorResponse(res, undefined, 'No es un tipo de archivo permitido.', Response.BAD_REQUEST);
		}
	} else {
		return Response.errorResponse(res, undefined, 'No se ha subido ningún archivo');
	}
}

function getKeepers(req, res) {
	User.find({
		role: 'admin'
	}).exec((err, users) => {
		if (err) {
			Response.errorResponse(res, err);
		} else if (users.length > 0) {
			Response.successResponse(res, users);
		} else {
			Response.errorResponse(res, undefined, 'No existen cuidadores registrados', Response.NOT_FOUND);
		}
	});
}

function getUserAvatar(req, res) {
	let fileName = req.params.fileName;
	let pathFile = `./uploads/users/${fileName}`;
	fs.exists(pathFile, (exists) => {
		if (exists) {
			res.sendFile(path.resolve(pathFile));
		} else {
			Response.errorResponse(res, undefined, 'La imagen no existe', Response.NOT_FOUND);
		}
	});
}

module.exports = {
	signUp,
	signIn,
	update,
	uploadAvatar,
	getKeepers,
	getUserAvatar
};
