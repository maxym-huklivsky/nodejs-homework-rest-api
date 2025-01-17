const express = require('express');
const { schemas } = require('../models/user');
const validate = require('../middlewares/validate');
const {
  register,
  login,
  getCurrent,
  logout,
  updateSubscription,
  updateAvatar,
  verificationEmail,
  resendVerifyEmail,
} = require('../controllers/auth');
const { authorizate, upload } = require('../middlewares');

const router = express.Router();

router.post('/register', validate(schemas.registerSchema), register);

router.post('/login', validate(schemas.loginSchema), login);

router.post('/logout', authorizate, logout);

router.get('/current', authorizate, getCurrent);

router.patch('/', authorizate, validate(schemas.subscriptionSchema), updateSubscription);

router.patch('/avatars', authorizate, upload.single('avatar'), updateAvatar);

router.get('/verify/:verificationToken', verificationEmail);

router.post('/verify', validate(schemas.vefifyEmail), resendVerifyEmail);

module.exports = router;
