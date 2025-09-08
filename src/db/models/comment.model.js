import { model, Schema, Types } from "mongoose";
import cloudinary from "../../utils/file-uploads/cloud-config.js";

const commentSchema = new Schema(
  {
    post: {
      type: Types.ObjectId,
      ref: "Post",
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: function () {
        return !this.attachment;
      },
    },
    attachment: {
      secure_url: String,
      public_id: String,
    },
    likes: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    parentComment: {
      type: Types.ObjectId,
      ref: "Comment",
    },
  },
  {
    timestamps: true,
  }
);

// A  (parent comment we delete)
// ├─ B  (reply to A)
// │  └─ D  (reply to B)
// └─ C  (reply to A)
//    └─ E
//       └─ F

commentSchema.post(
  "deleteOne",
  { query: false, document: true },
  async function (doc, next) {
    const replies = await this.constructor.find({ parentComment: doc._id });
    if (replies.length) {
      for (let reply of replies) {
        if (reply.attachment.public_id) {
          await cloudinary.uploader.destroy(reply.attachment.public_id);
        }
        await reply.deleteOne();
      }
    }
    return next();
  }
);
export const Comment = model("Comment", commentSchema);
