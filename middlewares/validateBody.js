const { HttpErrors } = require('../helpers/');

const validateBody = (contactSchema) => {
  const func = (req, res, next) => {
    const { error } = contactSchema.validate(req.body, { abortEarly: false });
        const emptyField = !Object.keys(req.body).length;
         
        if (emptyField) {
          throw HttpErrors(400, "missing fields")
      }
        if (error) {
          throw (HttpErrors(400, error.message))
        }
        next();
    };
    return func;
}

module.exports = validateBody;