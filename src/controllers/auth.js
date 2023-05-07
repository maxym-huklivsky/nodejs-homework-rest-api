const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { HttpError } = require('../helpers');
const { User } = require('../models/user');

require('dotenv').config();
const { SECRET_KEY } = process.env;

const register = async (req, res, next) => {
  try {
    const { email, password, subscription } = req.body;
    const isUser = await User.findOne({ email });

    if (isUser) {
      throw HttpError(409, 'Email in use');
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await User.create({ ...req.body, password: hashPassword });

    res.status(201).json({ user: { email, subscription } });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw HttpError(401, 'Email or password is wrong');
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      throw HttpError(401, 'Email or password is wrong');
    }

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '23h' });

    await User.findByIdAndUpdate(user._id, { token });

    const { subscription } = user;

    res.json({ token, user: { email, subscription } });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: '' });

  res.status(204).send();
};

const getCurrent = (req, res, next) => {
  const { email, subscription } = req.user;

  res.json({ email, subscription });
};

const updateSubscription = async (req, res, next) => {
  const { _id } = req.user;
  const { subscription } = req.body;

  const user = await User.findByIdAndUpdate(_id, { subscription }, { new: true });

  res.json({ subscription: user.subscription });
};

module.exports = { register, login, getCurrent, logout, updateSubscription };