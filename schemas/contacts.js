const Joi = require('joi');

const contactSchema = Joi.object({
    name: Joi.string().required().messages({
        "any.required": `'name' is a required field `,
        "string.empty": `'name' cannot be an empty field`,
  }),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().messages({
            "any.required": `'email'is a required field`,
            "string.empty": `The 'email' field must be a valid email address`,
            "string.email": `'email' must be a valid email`,
        }),
    phone: Joi.string().required().messages({
            "any.required": `'phone' is a required field`,
            "string.empty": `The 'phone' field must be a valid phone number`,
        }),
});

module.exports = {
    contactSchema,
}