import { Router } from "express";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { isAuthorized } from "../../middlewares/authorization.js";
import { cloudUpload } from "../../utils/file-uploads/multer-cloud.js";
import { roles } from "../../db/models/user.model.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import { fileTypes } from "../../utils/file-uploads/multer.js";
import * as postSchemas from './post.schemas.js'
import { asyncHandler } from "../../utils/index.js";
import * as postServices from './post.service.js'
import commentRouter from '../comment/comment.controller.js'

const router = Router()

router.use('/:postId/comment', commentRouter)

router.post(
    '/',
    isAuthenticated,
    isAuthorized(roles.USER),
    cloudUpload(fileTypes.images).array('attachment', 5),
    isValid(postSchemas.createPost),
    asyncHandler(postServices.createPost)
)
router.patch(
    '/like-unlike/:id',
    isAuthenticated,
    isAuthorized(roles.USER),
    isValid(postSchemas.likeOrUnlike),
    asyncHandler(postServices.likeOrUnlike)
)

router.get(
    '/',
    isAuthenticated,
    isAuthorized(roles.USER),
    asyncHandler(postServices.getPosts)
)
router.get(
    '/:id',
    isAuthenticated,
    isAuthorized(roles.USER),
    isValid(postSchemas.getSpecificPost),
    asyncHandler(postServices.getSpecificPost)
)
export default router