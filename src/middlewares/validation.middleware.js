import { Types } from "mongoose"

export const isValid = (schema) => {
    return (req, res, next) => {
        const data = {...req.body, ...req.params, ...req.query}
        if (req.file || req.files) data.attachment = req.files || req.file


        const result = schema.validate(data, {abortEarly: false})
        if(result.error){
            const messages = result.error.details.map((obj) => obj.message)
            return next(new Error (messages, {cause: 400}))
        }
        return next()
    }
}

export const isValidId = (value, helpers) => {
    if(!Types.ObjectId.isValid(value))
        return helpers.message('Invalid ID')
    return true
}