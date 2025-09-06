import path from "path";
import {
  defaultProfilePic,
  defaultPublicId,
  defaultSecureUrl,
  User,
} from "../../db/models/user.model.js";
import { decrypt } from "../../utils/index.js";
import { messages } from "../../utils/messages.js/index.js";
import fs from "fs";
import cloudinary from "../../utils/file-uploads/cloud-config.js";

export const getProfile = async (req, res, next) => {
  const user = req.authUser;
  user.phone = decrypt({ data: user.phone });
  return res.status(200).json({
    success: true,
    data: user,
  });
};

export const freezeAccount = async (req, res, next) => {
  await User.updateOne(
    { _id: req.authUser._id },
    { isDeleted: true, deletedAt: Date.now() }
  );

  return res
    .status(200)
    .json({ success: true, message: messages.user.deletedSuccessfully });
};

export const uploadProfilePic = async (req, res, next) => {
  const fullPath = path.resolve(req.authUser.profilePic);

  if (fs.existsSync(fullPath) && req.authUser.profilePic != defaultProfilePic)
    fs.unlinkSync(fullPath);

  const user = await User.findByIdAndUpdate(
    req.authUser._id,
    {
      profilePic: req.file.path,
    },
    {
      new: true,
    }
  );

  return res.status(201).json({
    success: true,
    data: user,
  });
};

export const uploadProfilePicCloud = async (req, res, next) => {
  // delete old pic
  //await cloudinary.uploader.destroy(req.authUser.profilePic.public_id);

  const options = {};

  if (req.authUser.profilePic.public_id == defaultPublicId)
    options.folder = `social-app/users/${req.authUser._id}/profile-pic`;
  else options.public_id = req.authUser.profilePic.public_id;

  // upload the pic to the cloud
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    options
    // {
    //   //folder: `social-app/users/${req.authUser._id}/profile-pic`,
    //   public_id: req.authUser.profilePic.public_id
    // }
  );

  // update database
  const user = await User.findByIdAndUpdate(
    req.authUser._id,
    {
      profilePic: { secure_url, public_id },
    },
    { new: true }
  );

  return res.status(200).json({ success: true, data: user });
};

export const uploadCoverPic = async (req, res, next) => {
  const coverPics = req.files.map((file) => file.path);
  await User.updateOne({ _id: req.authUser._id }, { coverPics });
  return res
    .status(201)
    .json({ success: true, message: "coverPic uploaded successfully" });
};

export const uploadCoverPicCloud = async (req, res, next) => {
  let coverPics = req.files.map((file) =>
    cloudinary.uploader.upload(file.path, {
      folder: `social-app/users/${req.authUser._id}/cover-pics`,
    })
  );
  const result = await Promise.all(coverPics)
  coverPics = result.map(doc => ({
    public_id: doc.public_id,
    secure_url: doc.secure_url
  }))
  const user = await User.updateOne({ _id: req.authUser._id }, { $push: { coverPics: { $each: coverPics } } });
  return res
    .status(201)
    .json({ success: true, message: "coverPic uploaded successfully", data:user });
};

// try on postman
export const deleteProfilePic = async (req, res, next) => {
  const fullPath = path.resolve(req.authUser.profilePic);
  if (fs.existsSync(fullPath) && req.authUser.profilePic != defaultProfilePic) {
    fs.unlinkSync(fullPath);
  }
  const user = await User.findByIdAndUpdate(
    req.authUser._id,
    {
      profilePic: defaultProfilePic,
    },
    { new: true }
  );
  return res.status(200).json({
    success: true,
    message: "profile picture deleted successfully",
    date: user,
  });
};

export const deleteprofilePicCloud = async (req, res, next) => {
  const path = req.authUser.profilePic.public_id;
  if (path && path != defaultPublicId) {
    await cloudinary.uploader.destroy(path);
  }
  const user = await User.findByIdAndUpdate(
    req.authUser._id,
    {
      profilePic: { defaultSecureUrl, defaultPublicId },
    },
    {
      new: true,
    }
  );

  return res
    .status(201)
    .json({ success: true, message: "profile pic deleted successfully", data:user });
};
