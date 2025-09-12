import joi from 'joi'
import { generalFields} from '../../middlewares/validation.middleware.js'
import { roles } from '../../db/models/user.model.js'
export const updateRole = joi.object({
    userId: generalFields.id,
    role: joi.string().valid(...Object.values(roles)).required()
}).required()