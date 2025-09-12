import { Router } from "express";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { isAuthorized } from "../../middlewares/authorization.js";
import { roles } from "../../db/models/user.model.js";
import { asyncHandler } from "../../utils/index.js";
import * as adminServices from './admin.service.js'
import { isValid } from "../../middlewares/validation.middleware.js";
import * as adminSchemas from './admin.schemas.js'


const router = Router()
router.use(isAuthenticated, isAuthorized(roles.ADMIN, roles.SUPER_ADMIN, roles.OWNER))


/**
 * @url /admin/data
 * @method get
*/
router.get('/data', asyncHandler(adminServices.getData))



/**
 * @url /admin/role
 * @method patch
*/
router.patch('/role',isValid(adminSchemas.updateRole), asyncHandler(adminServices.updateRole))


export default router