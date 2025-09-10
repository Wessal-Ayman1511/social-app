import { Post } from "../../db/models/post.model.js";
import cloudinary from "../../utils/file-uploads/cloud-config.js";
import { messages } from "../../utils/messages.js/index.js";
import { Comment } from "../../db/models/comment.model.js";

export const createPost = async (req, res, next) => {
  // upload to cloud
  // save in db
  let attachment = [];
  for (let file of req.files) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: `social-app/users/${req.authUser._id}/posts`,
      }
    );
    attachment.push({ secure_url, public_id });
  }
  const createdPost = await Post.create({
    content: req.body.content,
    attachment,
    publisher: req.authUser._id,
  });
  return res
    .status(201)
    .json({
      success: true,
      message: messages.post.createdSuccessfully,
      data: createdPost,
    });
};

export const likeOrUnlike = async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) return next(new Error(messages.post.notFound, { cause: 404 }));

  const userIdex = post.likes.indexOf(req.authUser._id);
  userIdex == -1
    ? post.likes.push(req.authUser._id)
    : post.likes.splice(userIdex, 1);

  const updatedPost = await post.save();
  return res.status(200).json({ success: true, data: updatedPost });
};

export const getPosts = async (req, res, next) => {
  //1) use of populate
  const posts = await Post.find().populate([
    { path: "publisher", select: "userName profilePic.secure_url" },
    { path: "likes", select: "userName profilePic.serure_url" },
    {path: "comments", populate: [{path: 'user', select: "userName"}]}
  ]);
    // const posts = await Post.aggregate([
    //     {
    //         $lookup: {
    //             from: 'users',
    //             foreignField: '_id',
    //             localField: 'publisher',
    //             as: 'publisher'
    //         }
    //     },
    //     {
    //         $unwind: '$publisher' // we do unwind because there is only one publisher and we want to access data from it in the next pipleline
    //     },
    //     {
    //         $lookup: {
    //             from: 'users',
    //             foreignField: '_id',
    //             localField: 'likes',
    //             as: 'likes'
    //         }
    //     },
    //     {
    //         $project: {
    //             'content': 1,
    //             'attachment.secure_url': 1,
    //             'publisher.userName': 1,
    //             'publisher.profilePic.secure_url': 1,
    //             'likes.userName':1,
    //             'likes.profilePic.secure_url': 1
    //         }
    //     }
    // ])

  return res.status(200).json({ success: true, data: posts });
};
export const getSpecificPost = async (req, res, next) => {
  //1) use of populate
  const {id} = req.params
  const post = await Post.findOne({_id: id, isDeleted:false}).populate([
    { path: "publisher", select: "userName profilePic.secure_url" },
    { path: "likes", select: "userName profilePic.serure_url" },
    {path: "comments", match: {parentComment: {$exists: false}}} // this get first layer comments
  ]);


  return post?res.status(200).json({ success: true, data: post }):next(new Error(messages.post.notFound, {cause:404}));
}; 

export const hardDeleteOfPost = async(req, res, next) => {
    // find post >> delete its attachements from cloud >> delete related comments

    const {id} = req.params

    const post = await Post.findOneAndDelete({
        _id: id,
        publisher: req.authUser._id
    }).populate([
        {path: 'comments', match: {parentComment: {$exists: false}}, select: '_id attachment'}
    ])

    if(!post) return next(new Error(messages.post.notFound, {cause: 404}))


    
    
    for (const item of post.attachment) {
        await cloudinary.uploader.destroy(item.public_id)
    }


    for (const comment of post.comments) {
        if (comment.attachment.public_id) await cloudinary.uploader.destroy(comment.attachment.public_id)
        await comment.deleteOne()
        
    }

    return res.status(200).json({
        success: true,
        message: messages.post.deletedSuccessfully
    })

}

export const archive = async(req, res, next) => {
    const {id} = req.params

    const post = await Post.findOneAndUpdate({
        _id: id,
        publisher: req.authUser._id,
        isDeleted: false
    }, {
        isDeleted: true
    })

    if(!post) return next(new Error(messages.post.notFound, {cause: 400}))
    
    return res.status(200).json({
        success: true,
        message: 'Post Archived Successfully'
    })
}
export const restore = async(req, res, next) => {
    const {id} = req.params

    const post = await Post.findOneAndUpdate({
        _id: id,
        publisher: req.authUser._id,
        isDeleted: true
    }, {
        isDeleted: false
    })

    if(!post) return next(new Error(messages.post.notFound, {cause: 400}))
    
    return res.status(200).json({
        success: true,
        message: 'Post Restored Successfully'
    })
}