const fs = require('fs/promises');
const path = require('path'); 
const { nanoid } = require('nanoid'); 
const contactsPath = path.join(__dirname, 'contacts.json'); 

const updateContacts = async (contacts) => {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2)); 
}

const listContacts = async () => {
  const contacts = await fs.readFile(contactsPath); 
  return JSON.parse(contacts);
};

const getContactById = async(contactId) => {
  const contacts = await listContacts(); 

  const result = contacts.find(contact => contact.id === contactId); 

  return result || null;
}

const removeContact = async(contactId) => {
  const contacts = await listContacts(); 

  const index = contacts.findIndex(item => item.id === contactId);
  if (index === -1) {
    return null; 
  }

  const [removeContact] = contacts.splice(index, 1);
  updateContacts(contacts); 
  return removeContact; 
}

const addContact = async (body) => {
  const contacts = await listContacts(); 

  const newContact = {
    id: nanoid(),
    ...body,
  }

  contacts.push(newContact);
  updateContacts(contacts); 
  return newContact; 
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(({ id }) => id === contactId);
  if (index === -1) {
    return null;
  }
  const updContact = contacts[index];
  contacts[index] = { ...updContact, ...body };
  updateContacts(contacts);
  return contacts[index];
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
}