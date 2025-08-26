import { User } from "../../db/models/user.model.js";
import { decrypt } from "../../utils/index.js";
import { messages } from "../../utils/messages.js/index.js";

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

  const user = await User.findOneAndUpdate(req.authUser._id, {
    profilePic: req.file.path
  }, {
    new: true
  })

  return res.status(201).json({
    success: true,
    data: user

  })

}