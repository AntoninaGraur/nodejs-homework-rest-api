import Joi from "joi";


const constactsAddSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "missing required name field",
  }),
  email: Joi.string().required().messages({
    "any.required": "missing required email field",
  }),
  phone: Joi.string().required().messages({
    "any.required": "missing required phone field",
  }),
  favorite:Joi.boolean(),
});

const contctsUpdateFavoriteschema = Joi.object({
  favorite: Joi.boolean().required(),
});

export default {constactsAddSchema, contctsUpdateFavoriteschema};