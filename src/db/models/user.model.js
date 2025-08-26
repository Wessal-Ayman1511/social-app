import { model, Schema } from "mongoose";
import {hash} from '../../utils/index.js'

export const genders = {
  MALE: "male",
  FEMALE: "female",
  F: "female",
  M: "male",
};

export const roles = {
  ADMIN: 'admin',
  USER: 'user'
}

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: [true, 'usename already exist'],
    },
    email: {
      type: String,
      required: true,
      unique: [true, 'email already exist'],
      lowercase: true
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: [true, 'phone already exist']
    },
    gender: {
      type: String,
      enum: Object.values(genders),
    },
    role: {
      type: String,
      enum: Object.values(roles)
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: {
      type: Date
    },
    profilePic: String
  },
  { timestamps: true }
);
userSchema.pre("save", function(next){
  if(this.isModified('password')){
    this.password = hash({data: this.password})
  }
  return next()
})
export const User = model("user", userSchema);


// Key takeaway from the example:
// If you want historical snapshots → embed.
// If you want live, reusable data → reference.

