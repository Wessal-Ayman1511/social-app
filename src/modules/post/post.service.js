import { Post } from "../../db/models/post.model.js"
import cloudinary from "../../utils/file-uploads/cloud-config.js"
import { messages } from "../../utils/messages.js/index.js"

export const createPost = async (req, res, next) => {
    // upload to cloud
    // save in db
    let attachment = []
    for(let file of req.files){
        const {secure_url, public_id} = await cloudinary.uploader.upload(file.path, {
            folder: `social-app/users/${req.authUser._id}/posts`
        })
        attachment.push({secure_url, public_id})
    }
    const createdPost = await Post.create({content: req.body.content, attachment, publisherId: req.authUser._id})
    return res.status(201).json({success: true, message: messages.post.createdSuccessfully, data: createdPost})

}