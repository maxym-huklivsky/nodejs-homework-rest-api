const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const Jimp = require('jimp');
const { HttpError } = require('../helpers');
const { User } = require('../models/user');
require('dotenv').config();
const { SECRET_KEY } = process.env;

const avatarsDir = path.join(__dirname, '..', '..', 'public', 'avatars');

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const isUser = await User.findOne({ email });

    if (isUser) {
      throw HttpError(409, 'Email in use');
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);

    const { subscription } = await User.create({ ...req.body, avatarURL, password: hashPassword });

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

const updateAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { path: tempUpload, originalname } = req.file;

    const resizeImg = await Jimp.read(tempUpload);
    await resizeImg.resize(250, 250);
    await resizeImg.writeAsync(tempUpload);

    const filename = `${_id}_${originalname}`;
    const resultPath = path.join(avatarsDir, filename);
    await fs.rename(tempUpload, resultPath);

    const avatarURL = path.join('avatars', filename);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getCurrent, logout, updateSubscription, updateAvatar };
