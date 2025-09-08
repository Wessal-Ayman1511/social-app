import { Router } from "express";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { isAuthorized } from "../../middlewares/authorization.js";
import { roles } from "../../db/models/user.model.js";
import { cloudUpload, fileTypes } from "../../utils/file-uploads/multer-cloud.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import * as commentSchemas from './comment.schemas.js'
import * as commentServices from './comment.service.js'
import { asyncHandler } from "../../utils/index.js";


const router = Router({mergeParams: true})
// its a child for post /post/postId/comment to access it
router.post(
    '/:id?', // optionsal as you can add comment or reply to comment
    isAuthenticated,
    isAuthorized(roles.USER),
    cloudUpload(fileTypes.images).single('attachment'),
    isValid(commentSchemas.createComment),
    asyncHandler(commentServices.createComment)

)

router.get(
    '/:id?',
    isAuthenticated,
    isAuthorized(roles.USER),
    isValid(commentSchemas.getComment),
    asyncHandler(commentServices.getComments)

)

/**
 * @method delete
 * @route /post/postId/comment/id
 */

router.delete(
    '/:id',
    isAuthenticated,
    isAuthorized(roles.USER),
    isValid(commentSchemas.deleteComment),
    asyncHandler(commentServices.deleteComment)
)


export default router