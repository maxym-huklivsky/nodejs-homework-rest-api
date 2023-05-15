const Joi = require('joi');
const mongoose = require('mongoose');
const { emailRegexp } = require('./regexps');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, 'Set password for user'],
      minlength: 8,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: emailRegexp,
      unique: true,
    },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    avatarURL: {
      type: String,
      required: true,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, 'Verify token is required'],
    },
    token: String,
  },
  { versionKey: false },
);

const registerSchema = Joi.object({
  password: Joi.string().min(8).required(),
  email: Joi.string().pattern(emailRegexp).required(),
  subscription: Joi.string().default('starter'),
});

const loginSchema = Joi.object({
  password: Joi.string().min(8).required(),
  email: Joi.string().pattern(emailRegexp).required(),
});

const vefifyEmail = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    'any.required': `missing required field email`,
  }),
});

const subscriptionSchema = Joi.object({
  subscription: Joi.string().valid('starter', 'pro', 'business').required(),
});

const schemas = {
  registerSchema,
  loginSchema,
  subscriptionSchema,
  vefifyEmail,
};

const User = mongoose.model('user', userSchema);

module.exports = { User, schemas };
