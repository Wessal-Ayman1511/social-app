import { Router } from "express";
import * as userServices from './user.service.js'
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
const router = Router()

router.get('/profile', isAuthenticated, userServices.getProfile)
router.delete('/freeze', isAuthenticated, userServices.freezeAccount)

export default router