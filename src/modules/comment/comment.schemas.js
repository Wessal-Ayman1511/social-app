import joi from "joi";
import { generalFields, isValidId } from "../../middlewares/validation.middleware.js";
/**
 * @params postId
 * @body text
 * @file attachment
 */

export const createComment = joi
  .object({
    id: joi.custom(isValidId),
    postId: generalFields.id,
    text: joi.string(),
    attachment: generalFields.attachment,
  })
  .or("text", "attachment")
  .required();

/**
 * @params postId
 */
export const getComment = joi
  .object({

    postId: generalFields.id,
  })
  .required();
