import { Router } from "express";
import * as userServices from './user.service.js'
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { fileUpload } from "../../utils/file-uploads/multer.js";
import { asyncHandler } from "../../utils/index.js";
const router = Router()

router.get('/profile', isAuthenticated, asyncHandler(userServices.getProfile))
router.delete('/freeze', isAuthenticated, asyncHandler(userServices.freezeAccount))
router.post('/profile-pic', isAuthenticated, fileUpload().single('image'), asyncHandler(userServices.uploadProfilePic))

export default router