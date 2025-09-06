import { Router } from "express";
import * as userServices from "./user.service.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { fileUpload, fileTypes } from "../../utils/file-uploads/multer.js";
import { asyncHandler } from "../../utils/index.js";
import { validateFiles } from "../../middlewares/file.validation.js";
import { cloudUpload } from "../../utils/file-uploads/multer-cloud.js";
const router = Router();

router.get("/profile", isAuthenticated, asyncHandler(userServices.getProfile));
router.delete(
  "/freeze",
  isAuthenticated,
  asyncHandler(userServices.freezeAccount)
);
//router.post('/profile-pic', isAuthenticated, fileUpload(fileTypes.images, 'uploads/users').single('image'),  validateFiles({image: fileTypes.images}), asyncHandler(userServices.uploadProfilePic))
router.post(
  "/profile-pic",
  isAuthenticated,
  cloudUpload(fileTypes.images).single("image"),
  validateFiles({ image: fileTypes.images }),
  asyncHandler(userServices.uploadProfilePicCloud)
);
//router.post('/cover-pic', isAuthenticated, fileUpload(fileTypes.images).array('images'), validateFiles({images: fileTypes.images}), asyncHandler(userServices.uploadCoverPic))
router.post(
  "/cover-pic",
  isAuthenticated,
  fileUpload(fileTypes.images).array("images"),
  validateFiles({ images: fileTypes.images }),
  asyncHandler(userServices.uploadCoverPicCloud)
);
//router.delete('/profile-pic', isAuthenticated, asyncHandler(userServices.deleteProfilePic))
router.delete(
  "/profile-pic",
  isAuthenticated,
  asyncHandler(userServices.deleteprofilePicCloud)
);

export default router;
