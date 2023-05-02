const { HttpError } = require('../helpers');

const validate = (schema) => (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = validate;
