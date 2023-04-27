const express = require('express');

const {
  getContacts,
  getById,
  postContact,
  deleteContact,
  putContact,
} = require('../../controllers/contacts-controller');

const router = express.Router();

router.get('/', getContacts);

router.get('/:contactId', getById);

router.post('/', postContact);

router.delete('/:contactId', deleteContact);

router.put('/:contactId', putContact);

module.exports = router;
