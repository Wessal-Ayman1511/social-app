import { model, Schema, Types } from "mongoose";

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

export const Comment = model("Comment", commentSchema);
