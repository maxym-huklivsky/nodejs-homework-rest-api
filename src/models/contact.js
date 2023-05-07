const mongoose = require('mongoose');
const Joi = require('joi');
const { emailRegexp, phoneRegexp } = require('./regexps');

const Schema = mongoose.Schema;

const contactSchema = new Schema(
  {
    name: { type: String, required: [true, `missing required name field`] },
    email: { type: String, required: [true, `missing required email field`], match: emailRegexp },
    phone: { type: String, required: [true, `missing required phone field`], match: phoneRegexp },
    favorite: { type: Boolean, default: false },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { versionKey: false },
);

const postSchema = Joi.object({
  name: Joi.string().min(3).max(16).required().messages({
    'any.required': `missing required name field`,
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    'any.required': `missing required email field`,
  }),
  phone: Joi.string().pattern(phoneRegexp).required().messages({
    'any.required': `missing required phone field`,
  }),
  favorite: Joi.boolean().default(false),
});

const putSchema = Joi.object({
  name: Joi.string().min(3).max(16),
  email: Joi.string().pattern(emailRegexp),
  phone: Joi.string().pattern(phoneRegexp),
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
