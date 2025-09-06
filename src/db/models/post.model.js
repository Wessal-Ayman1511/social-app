import { model } from "mongoose";
import { Schema, Types } from "mongoose";

const postSchema = new Schema(
  {
    content: {
      type: String,
      required: function () {
        return this.attachment.length == 0;
      },
    },
    attachment: {
      type: [
        {
          secure_url: String,
          public_id: String,
        },
      ],
    },
    publisher: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    likes: [{
        type: Types.ObjectId,
        ref: "User",
    }],
    isDeleted: {
        type: Boolean,
        default: false
    }
  },
  { timestamps: true }
);

export const Post = model('Post', postSchema)