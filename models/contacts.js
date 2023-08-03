const Joi = require("joi");
const { Schema, model } = require("mongoose");

const {handleMongooseError, handleUpdateValidate} = require("./hooks")

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
  ref: 'user',
    require:true,
  },
}, { versionKey: false, timestamps: true });

contactSchema.pre("findOneAndUpdate", handleUpdateValidate);
contactSchema.post("save", handleMongooseError);
contactSchema.post("findOneAndUpdate", handleMongooseError);

const contactAddSchema = Joi.object({
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
    favorite: Joi.boolean(),
})

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
            "any.required": `missing field 'favorite'`,            
        }),
});

const schemas = {
  contactAddSchema,
  updateFavoriteSchema,
}

const contactsService = model("contacts", contactSchema);

module.exports = {
  contactsService,
  schemas,
} 