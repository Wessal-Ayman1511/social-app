import { User } from "../../db/models/user.model.js";
import { decrypt } from "../../utils/index.js";
import { messages } from "../../utils/messages.js/index.js";
export const getProfile = async (req, res, next) => {
  try {

    const user = req.authUser
    user.phone = decrypt({data: user.phone})
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const freezeAccount = async(req, res, next) => {

  await User.updateOne({_id: req.authUser._id}, {isDeleted: true, deletedAt:Date.now()})

  return res.status(200).json({success: true, message: messages.user.deletedSuccessfully})

}