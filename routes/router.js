'use strict';

const express = require('express');
const api = express.Router();
const auth = require('../middlewares/auth');
const multipart = require('connect-multiparty');
const uploadAvatarUser = multipart({
    uploadDir: './uploads/users'
});
const uploadImageAnimals = multipart({
    uploadDir: './uploads/animals'
});

// Controllers
const userCtrl = require('../controllers/userCtrl');
const animalCtrl = require('../controllers/animalCtrl');

api.post('/UserController/registrar', userCtrl.signUp);
api.post('/UserController/login', userCtrl.signIn);
api.put('/UserController/update/:userId', auth.isAuth, userCtrl.update);
api.post('/UserController/uploadAvatar/:userId', [auth.isAuth, uploadAvatarUser], userCtrl.uploadAvatar);
api.get('/UserController/getUserAvatar/:fileName', userCtrl.getUserAvatar);
api.get('/UserController/getKeepers', userCtrl.getKeepers);

api.post('/AnimalController/animal', auth.isAuth, animalCtrl.saveAnimal);
api.get('/AnimalController/animal/:animalId', animalCtrl.getOne);
api.put('/AnimalController/animal/:animalId', auth.isAuth, animalCtrl.update);
api.get('/AnimalController/getAll', animalCtrl.getAll);
api.post('/AnimalController/uploadImage/:animalId', [auth.isAuth, uploadImageAnimals], animalCtrl.uploadImage);
api.delete('/AnimalController/animal/:animalId', [auth.isAuth], animalCtrl.deleteAnimal);

module.exports = api;
