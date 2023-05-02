const express = require('express');
const { validate, isValidId } = require('../middlewares');
const { schemas } = require('../models/contact');
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require('../controllers/contacts-controller');

const router = express.Router();

router.get('/', listContacts);

router.get('/:contactId', isValidId, getContactById);

router.post('/', validate(schemas.postSchema), addContact);

router.delete('/:contactId', isValidId, removeContact);

router.put('/:contactId', isValidId, validate(schemas.putSchema), updateContact);

router.patch(
  '/:contactId/favorite',
  isValidId,
  validate(schemas.favoriteSchema),
  updateStatusContact,
);

module.exports = router;
