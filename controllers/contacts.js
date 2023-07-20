const { CtrlWrapper, HttpErrors } = require('../helpers'); 
const contactsService = require('../models/contacts'); 

const getAllContacts = async (req, res) => {
  const result = await contactsService.listContacts(); 
  res.json(result); 
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;

  const result = await contactsService.getContactById(contactId); 

  if (!result) {
    throw HttpErrors(404, 'Not found'); 
  }

  res.json(result); 
};

const addContact = async (req, res) => {
  const result = await contactsService.addContact(req.body); 
  res.status(201).json(result);  
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params; 

  const result = await contactsService.removeContact(contactId);
  if (!result) {
    throw HttpErrors(404, 'Not found');
  }

  res.json({ "message": "contact deleted" }); 
};

const updateContact = async (req, res) => {
  const { contactId } = req.params; 

  const result = await contactsService.updateContact(contactId, req.body); 
  
  if (!result) {
    throw HttpErrors(404, 'Not found');
  }

  res.json(result);
};

module.exports = {
  getAllContacts: CtrlWrapper(getAllContacts),
  getContactById: CtrlWrapper(getContactById), 
  addContact: CtrlWrapper(addContact), 
  deleteContact: CtrlWrapper(deleteContact), 
  updateContact: CtrlWrapper(updateContact), 
};