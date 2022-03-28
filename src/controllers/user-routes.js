const express = require('express');
const router = express.Router();
const userRepository = require('../models/user-repository');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.get('/', (req, res) => {
  res.send(userRepository.getUsers())
});

router.get('/:firstName', (req, res) => {
  const foundUser = userRepository.getUserByFirstName(req.params.firstName);

  if (!foundUser) {
    throw new Error('User not found');
  }

  res.send(foundUser);
});

router.post('/', (req, res) => {
  userRepository.createUser(req.body);
  res.status(201).end();
});

router.put('/:id', (req, res) => {
  userRepository.updateUser(req.params.id, req.body);
  res.status(204).end();
});

router.delete('/:id', (req, res) => {
  userRepository.deleteUser(req.params.id);
  res.status(204).end();
});

//création nouvelle route login
router.post('/login', (req, res) => {
  const body = req.body;
  const firstName = body.firstName;
  const password = body.password;
  const existingUser = userRepository.getUserByFirstName(firstName);

  if (!existingUser) {
    throw new Error('Utilisateur non trouvé');
  }

  if (!bcrypt.compareSync(password, existingUser.password)) {
    throw new Error('mauvais mot de passe');
  }

 
  const token = jwt.sign(existingUser, 'toto');  //(nom et clé de décryptage

  res.send(token);


})

exports.initializeRoutes = () => {
  return router;
}
