import { Post } from "../../db/models/post.model.js"
import { roles, User } from "../../db/models/user.model.js"



export const getData = async(req, res, next) => {
    const result = await Promise.all([User.find(), Post.find()])

    return res.status(201).json({success: true, data: result})
}


export const updateRole = async (req, res, next) => {
    const {userId, role} = req.body

    const updaterRole = req.authUser.role
    const user = await User.findById(userId)

    const rolesHeirarchy = Object.values(roles)
    const updaterRoleIndx = rolesHeirarchy.indexOf(updaterRole)
    const userRoleIndex = rolesHeirarchy.indexOf(user.role)
    const updatedRoleIdex = rolesHeirarchy.indexOf(role)

    if(updaterRoleIndx < userRoleIndex) return next(new Error("You aren't allowed!😤", {cause: 401}))
    if(updatedRoleIdex > updaterRoleIndx) return next(new Error("You don't have this privilage😤", {cause: 401}))

    const updatedUser = await User.findByIdAndUpdate(userId, {role, updatedBy: req.authUser._id}, {new: true})

    return res.status(200).json({success: true, data: updatedUser})
    
}