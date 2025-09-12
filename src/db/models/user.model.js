import { model, Schema, Types } from "mongoose";
import { hash } from "../../utils/index.js";

export const genders = {
  MALE: "male",
  FEMALE: "female",
  F: "female",
  M: "male",
};

export const roles = {
  USER: "user",
  ADMIN: "admin",
  SUPER_ADMIN: 'superAdmin',
  OWNER: 'owner'
  
  
};

export const defaultProfilePic = "uploads/default.jpeg";
export const defaultSecureUrl =
  "https://res.cloudinary.com/dheqckgyt/image/upload/v1756844329/download_wnzi7h.jpg";
export const defaultPublicId = "download_wnzi7h";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: [true, "usename already exist"],
    },
    email: {
      type: String,
      required: true,
      unique: [true, "email already exist"],
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider == "system" ? true : false;
      },
    },
    phone: {
      type: String,
      required: function () {
        return this.provider == "system" ? true : false;
      },
      unique: [true, "phone already exist"],
    },
    gender: {
      type: String,
      enum: Object.values(genders),
    },
    role: {
      type: String,
      enum: Object.values(roles),
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    // profilePic: {
    //   type: String,
    //   default: defaultProfilePic
    // },
    profilePic: {
      secure_url: {
        type: String,
        default: defaultSecureUrl,
      },
      public_id: {
        type: String,
        default: defaultPublicId,
      },
    },
    // coverPics: [String],
    coverPics: [{
      secure_url: {
        type: String,
        default: defaultSecureUrl,
      },
      public_id: {
        type: String,
        default: defaultPublicId,
      },
    }],
    provider: {
      type: String,
      enum: ["google", "system"],
      default: "system",
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);
userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = hash({ data: this.password });
  }
  return next();
});
export const User = model("User", userSchema);

// Key takeaway from the example:
// If you want historical snapshots → embed.
// If you want live, reusable data → reference.
