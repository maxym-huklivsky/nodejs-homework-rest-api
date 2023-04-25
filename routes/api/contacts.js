const express = require('express');

const contacts = require('../../models/contacts');
const { HttpError } = require('../../helpers');
const { postSchema, putSchema } = require('../../validateSchemas');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await contacts.listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.getContactById(contactId);

    if (result === null) {
      throw HttpError(404, 'Not Found');
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { body } = req;
    const { error } = postSchema.validate(body);

    if (error) {
      throw HttpError(400, error.message);
    }

    const result = await contacts.addContact(body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.removeContact(contactId);

    if (result === null) {
      throw HttpError(404, 'Not Found');
    }

    res.json({ message: 'contact deleted' });
  } catch (error) {
    next(error);
  }
});

router.put('/:contactId', async (req, res, next) => {
  try {
    const { body } = req;

    if (!body.name && !body.email && !body.phone) {
      throw HttpError(400, 'missing fields');
    }

    const { error } = putSchema.validate(body);

    if (error) {
      throw HttpError(400, error.message);
    }

    const { contactId } = req.params;
    const result = await contacts.updateContact(contactId, body);

    if (result === null) {
      throw HttpError(404, 'Not Found');
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
