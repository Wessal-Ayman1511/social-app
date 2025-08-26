import { Router } from "express";
import * as authServices from './auth.service.js'
import { asyncHandler } from "../../utils/error/async-handler.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import * as authSchemas from './auth.schemas.js'

const router = Router()
router.post('/send-otp', isValid(authSchemas.sendOTP), asyncHandler(authServices.sendOTP))
router.post('/register', isValid(authSchemas.register),asyncHandler(authServices.register))
router.post('/login',isValid(authSchemas.login) ,asyncHandler(authServices.login))
router.get('/activate-account/:token', asyncHandler(authServices.activateAccount))
router.post('/refresh-token', isValid(authSchemas.refresh), asyncHandler(authServices.refreshToken))



export default router