const { Contact } = require('../models/contact');
const { HttpError } = require('../helpers');

const listContacts = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { page = 1, limit = 3, favorite } = req.query;

    const skip = (page - 1) * limit;

    if (favorite) {
      const totalPages = Math.ceil([...(await Contact.find({ owner, favorite }))].length / limit);

      const data = await Contact.find({ owner, favorite })
        .skip(skip)
        .limit(limit)
        .populate('owner', 'email');

      res.json({ totalPages, page: Number(page), limit: Number(limit), data });
    }

    const totalPages = [...(await Contact.find({ owner }))].length;

    const data = await Contact.find({ owner }).skip(skip).limit(limit).populate('owner', 'email');

    res.json({ totalPages, page: Number(page), limit: Number(limit), data });
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);

    if (result === null) {
      throw HttpError(404, `Not found contact with id: ${contactId}`);
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;

    const result = await Contact.create({ ...req.body, owner });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndDelete(contactId);

    if (result === null) {
      throw HttpError(404, `Not found contact with id: ${contactId}`);
    }

    res.json({ message: 'contact deleted' });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { body } = req;

    if (!body.name && !body.email && !body.phone && !body.favorite) {
      throw HttpError(400, 'missing fields');
    }

    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, body, { new: true });

    if (result === null) {
      throw HttpError(404, `Not found contact with id: ${contactId}`);
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });

    if (result === null) {
      throw HttpError(404, `Not found contact with id: ${contactId}`);
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
};
