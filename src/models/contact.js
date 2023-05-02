const mongoose = require('mongoose');
const Joi = require('joi');

const phoneRegex = /^[0-9\-\+]{9,15}$/;
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const Schema = mongoose.Schema;

const contactSchema = new Schema({
  name: { type: String, required: [true, `missing required name field`] },
  email: { type: String, required: [true, `missing required email field`], match: emailRegex },
  phone: { type: String, required: [true, `missing required phone field`], match: phoneRegex },
  favorite: { type: Boolean, default: false },
});

const postSchema = Joi.object({
  name: Joi.string().min(3).max(16).required().messages({
    'any.required': `missing required name field`,
  }),
  email: Joi.string().pattern(emailRegex).required().messages({
    'any.required': `missing required email field`,
  }),
  phone: Joi.string().pattern(phoneRegex).required().messages({
    'any.required': `missing required phone field`,
  }),
  favorite: Joi.boolean().default(false),
});

const putSchema = Joi.object({
  name: Joi.string().min(3).max(16),
  email: Joi.string().pattern(emailRegex),
  phone: Joi.string().pattern(phoneRegex),
  favorite: Joi.boolean(),
});

const favoriteSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
    'any.required': `missing field favorite`,
  }),
});

const schemas = { postSchema, putSchema, favoriteSchema };

const Contact = mongoose.model('contact', contactSchema);

module.exports = { Contact, schemas };
