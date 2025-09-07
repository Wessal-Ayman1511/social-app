import { Types } from "mongoose";
import joi from "joi";

export const generalFields = {
  id: joi.custom(isValidId).required(),
  attachment: joi.object({
    fieldname: joi.string().required(),
    originalname: joi.string().required(),
    encoding: joi.string().required(),
    mimetype: joi.string().required(),
    destination: joi.string().required(),
    filename: joi.string().required(),
    path: joi.string().required(),
    size: joi.number().required(),
  }),
};
export const isValid = (schema) => {
  return (req, res, next) => {
    const data = { ...req.body, ...req.params, ...req.query };
    if (req.file || req.files) data.attachment = req.files || req.file;

    const result = schema.validate(data, { abortEarly: false });
    if (result.error) {
      const messages = result.error.details.map((obj) => obj.message);
      return next(new Error(messages, { cause: 400 }));
    }
    return next();
  };
};

export function isValidId(value, helpers) {
  if (!Types.ObjectId.isValid(value)) return helpers.message("Invalid ID");
  return true;
}
