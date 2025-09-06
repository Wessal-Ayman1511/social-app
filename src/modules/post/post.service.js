import { Post } from "../../db/models/post.model.js";
import cloudinary from "../../utils/file-uploads/cloud-config.js";
import { messages } from "../../utils/messages.js/index.js";

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
  // 1) use of populate
//   const posts = await Post.find().populate([
//     { path: "publisher", select: "userName profilePic.secure_url" },
//     { path: "likes", select: "userName profilePic.serure_url" },
//   ]);
    const posts = await Post.aggregate([
        {
            $lookup: {
                from: 'users',
                foreignField: '_id',
                localField: 'publisher',
                as: 'publisher'
            }
        },
        {
            $unwind: '$publisher' // we do unwind because there is only one publisher and we want to access data from it in the next pipleline
        },
        {
            $lookup: {
                from: 'users',
                foreignField: '_id',
                localField: 'likes',
                as: 'likes'
            }
        },
        {
            $project: {
                'content': 1,
                'attachment.secure_url': 1,
                'publisher.userName': 1,
                'publisher.profilePic.secure_url': 1,
                'likes.userName':1,
                'likes.profilePic.secure_url': 1
            }
        }
    ])

  return res.status(200).json({ success: true, data: posts });
};
