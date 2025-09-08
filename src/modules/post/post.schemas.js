import joi from "joi";
import { generalFields, isValidId } from "../../middlewares/validation.middleware.js";

export const createPost = joi
  .object({
    content: joi.string(),
    // .when("attachment", {
    //     is: joi.exist(),
    //     then: joi.optional(),
    //     otherwise: joi.required()
    // })
    attachment: joi.array().items(
      joi.object({
        fieldname: joi.string().required(),
        originalname: joi.string().required(),
        encoding: joi.string().required(),
        mimetype: joi.string().required(),
        destination: joi.string().required(),
        filename: joi.string().required(),
        path: joi.string().required(),
        size: joi.number().required(),
      })
    ),
  })
  .or("content", "attachment")
  .required();

export const likeOrUnlike = joi.object({
  id: generalFields.id
});


export const getSpecificPost = joi.object({
  id: generalFields.id
});


export const hardDeleteOfPost = joi.object({
  id: generalFields.id
});
