import { Comment } from "../../db/models/comment.model.js";
import { Post } from "../../db/models/post.model.js";
import cloudinary from "../../utils/file-uploads/cloud-config.js";
import { messages } from "../../utils/messages.js/index.js";

export const createComment = async (req, res, next) => {
  // postId, user, text, attachment
  const { postId, id } = req.params;
  const { text } = req.body;
  console.log(id);

  const post = await Post.findById(postId);
  if (!post) return next(new Error(messages.post.notFound, { cause: 404 }));

  let attachment = {};
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `social-app/users/${post.publisher}/posts/comments` }
    );
    attachment = { secure_url, public_id };
  }

  const createdComment = await Comment.create({
    post: postId,
    user: req.authUser._id,
    text,
    attachment,
    parentComment: id,
  });

  return res.status(201).json({
    success: true,
    message: messages.comment.createdSuccessfully,
    data: createdComment,
  });
};

export const getComments = async (req, res, next) => {
  const { postId, id } = req.params;

  const comments = await Comment.find({
    post: postId,
    parentComment: id,
  }).populate([
    { path: "user", select: "userName profilePic.secure_url" },
    { path: "likes", select: "userName profilePic" },
  ]);

  return res.status(200).json({
    success: true,
    data: comments,
  });
};

export const deleteComment = async (req, res, next) => {
  const { postId, id } = req.params;

  const comment = await Comment.findById(id).populate([{ path: "post" }]);

  if(!comment) return next(new Error(messages.comment.notFound, {cause: 404}))

  //chack owner of the post and owener of the comment
  if (
    req.authUser._id.toString() != comment.user.toString() &&
    req.authUser._id.toString() != comment.post.publisher.toString()
  ) {
    return next(new Error("you are not allowed!😤", { cause: 401 }));
  }

  if(comment.attachment.public_id) await cloudinary.uploader.destroy(comment.attachment.public_id)

    await comment.deleteOne()

    return res.status(200).json({
        success: true,
        message: messages.comment.deletedSuccessfully
    })

};
