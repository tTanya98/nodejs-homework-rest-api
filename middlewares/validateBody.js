const { HttpErrors } = require('../helpers');

const validateBody = (contactSchema) => {
  const func = (req, res, next) => {
    const { error } = contactSchema.validate(req.body); 
  
  if (error) {
      throw (HttpErrors(400, error.message))
  }
  next();
};
return func;
}

module.exports = validateBody;