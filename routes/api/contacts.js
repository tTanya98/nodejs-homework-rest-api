const express = require('express');
const router = express.Router();
const ctrl = require("../../controllers/contacts");
const { validateBody, isValidId, isEmptyBody, authenticate} = require("../../middlewares");
const { schemas } = require("../../models/contacts");

router.get('/', authenticate, ctrl.getAllContacts);
router.get('/:contactId',authenticate, isValidId, ctrl.getContactById);
router.post('/', authenticate, validateBody(schemas.contactAddSchema), ctrl.addContact);
router.delete('/:contactId',authenticate, isValidId, ctrl.deleteContact);
router.put('/:contactId',authenticate, isValidId, validateBody(schemas.contactAddSchema), ctrl.updateContact);
router.patch('/:contactId/favorite',authenticate, isEmptyBody, isValidId, validateBody(schemas.updateFavoriteSchema), ctrl.updateStatusContact);

module.exports = router