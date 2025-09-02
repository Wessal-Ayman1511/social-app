import path from "path";
import { defaultProfilePic, User } from "../../db/models/user.model.js";
import { decrypt } from "../../utils/index.js";
import { messages } from "../../utils/messages.js/index.js";
import fs from 'fs'

export const getProfile = async (req, res, next) => {

    const user = req.authUser
    user.phone = decrypt({data: user.phone})
    return res.status(200).json({
      success: true,
      data: user,
    });
  }

export const freezeAccount = async(req, res, next) => {

  await User.updateOne({_id: req.authUser._id}, {isDeleted: true, deletedAt:Date.now()})

  return res.status(200).json({success: true, message: messages.user.deletedSuccessfully})

}

export  const uploadProfilePic = async(req, res, next) => {


  const fullPath = path.resolve(req.authUser.profilePic)


  if(fs.existsSync(fullPath) && req.authUser.profilePic != defaultProfilePic)  fs.unlinkSync(fullPath)

  const user = await User.findByIdAndUpdate(req.authUser._id, {
    profilePic: req.file.path
  }, {
    new: true
  })

  return res.status(201).json({
    success: true,
    data: user

  })

}

export const uploadCoverPic = async(req, res, next) => {
  const coverPics = req.files.map(file => file.path)
  await User.updateOne({_id: req.authUser._id}, {coverPics})
  return res.status(201).json({success:true, message: "coverPic uploaded successfully"})
}