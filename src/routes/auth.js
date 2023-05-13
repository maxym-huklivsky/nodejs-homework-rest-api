const express = require('express');
const { schemas } = require('../models/user');
const validate = require('../middlewares/validate');
const { register, login, getCurrent, logout, updateSubscription } = require('../controllers/auth');
const { authorizate } = require('../middlewares');

const router = express.Router();

router.post('/register', validate(schemas.registerSchema), register);

router.post('/login', validate(schemas.loginSchema), login);

router.post('/logout', authorizate, logout);

router.get('/current', authorizate, getCurrent);

router.patch('/', authorizate, validate(schemas.subscriptionSchema), updateSubscription);

module.exports = router;
