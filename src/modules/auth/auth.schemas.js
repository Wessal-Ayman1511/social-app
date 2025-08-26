import joi from "joi";
import { genders, roles } from "../../db/models/user.model.js";


export const sendOTP = joi.object({
    email: joi.string().email().required()
}).required()


export const register = joi.object({
    userName: joi.string().min(2).max(20).required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    cPassword: joi.string().valid(joi.ref('password')).required(),
    phone: joi.string().required(),
    gender: joi.string().valid(...Object.values(genders)),
    role: joi.string().valid(...Object.values(roles)),
    otp: joi.string().length(5).required()
}).required()


export const login = joi.object({

    email: joi.string().email().required(),
    password: joi.string().required(),

}).required()


export const refresh = joi.object({
    refreshedToken: joi.string().required()
}).required()
