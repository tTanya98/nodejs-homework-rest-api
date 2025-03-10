const { CtrlWrapper, HttpErrors } = require('../helpers/index'); 
const { contactsService } = require('../models/contacts'); 

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, favorite = true} = req.query;
  const skip = (page - 1) * limit;
     const result = await contactsService.find({ owner }, "", { skip, limit: Number(limit), favorite })
      .populate("owner", "email"); 
  res.json(result); 
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;

  const result = await contactsService.findById(contactId); 

  if (!result) {
    throw HttpErrors(404, 'Not found'); 
  }

  res.json(result); 
};

const addContact = async (req, res) => {
  const {_id: owner} = req.user;
  const result = await contactsService.create({ ...req.body, owner });
  res.status(201).json(result);
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params; 

  const result = await contactsService.findByIdAndRemove(contactId);
  if (!result) {
    throw HttpErrors(404, 'Not found');
  }

  res.json({ "message": "contact deleted" }); 
};

const updateContact = async (req, res) => {
  const { contactId } = req.params; 

  const result = await contactsService.findByIdAndUpdate(contactId, req.body, {new:true}); 
  
  if (!result) {
    throw HttpErrors(404, 'Not found');
  }

  res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
const result = await contactsService.findByIdAndUpdate(contactId, req.body, {new:true});
if (!result) {
 throw HttpErrors(404, "Not found");
}
res.status(200).json(result);

}

module.exports = {
  getAllContacts: CtrlWrapper(getAllContacts),
  getContactById: CtrlWrapper(getContactById), 
  addContact: CtrlWrapper(addContact), 
  deleteContact: CtrlWrapper(deleteContact), 
  updateContact: CtrlWrapper(updateContact), 
  updateStatusContact: CtrlWrapper(updateStatusContact),
};