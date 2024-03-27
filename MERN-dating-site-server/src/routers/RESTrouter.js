const express = require('express');

const { saveUser, loginUser, getUser } = require('../controllers/userControler');
const { regValidator } = require('../middleware/validator');

const mainRouter = express.Router();
mainRouter.post('/users/login', loginUser);
mainRouter.post('/users', regValidator, saveUser);
mainRouter.get('/users/:secret', getUser);
module.exports = mainRouter;
