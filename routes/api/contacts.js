const express = require('express');

const router = express.Router();

const ctrl = require("../../controllers/contacts");

const { validateBody, isValidId, isEmptyBody } = require("../../middlewares");
const { schemas } = require("../../models/contact");

router.get('/', ctrl.getAllContacts);

router.get('/:contactId',isValidId, ctrl.getContactById);

router.post('/', validateBody(schemas.contactAddSchema), ctrl.addContact);

router.delete('/:contactId',isValidId, ctrl.deleteContact);
  
router.put('/:contactId',isValidId, validateBody(schemas.contactAddSchema), ctrl.updateContact);

router.patch('/:contactId/favorite',isEmptyBody, isValidId, validateBody(schemas.updateFavoriteSchema), ctrl.updateStatusContact);

module.exports = router;