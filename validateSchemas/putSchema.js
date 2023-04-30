const Joi = require('joi');

const putSchema = Joi.object({
  name: Joi.string().min(3).max(16),
  email: Joi.string().email(),
  phone: Joi.string(),
});

module.exports = putSchema;
