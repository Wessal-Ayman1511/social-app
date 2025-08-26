import { User } from "../../db/models/user.model.js";
import Randomstring from "randomstring";
import {
  sendEmail,
  generateToken,
  verifyToken,
  hash,
  compare,
  encypt,
  sendEmailEvent,
} from "../../utils/index.js";
import { messages } from "../../utils/messages.js/index.js";
import { OTP } from "../../db/models/otp.model.js";
// we hash password(one way), we encrypt personal info(two way)

export const sendOTP = async (req, res, next) => {
  const {email} = req.body
  const existUser = await User.findOne({email: email})
  if(existUser) return next(new Error(messages.user.alreadyExist, {cause:400}))
  const otp = Randomstring.generate({length:5, "charset":"numeric"})
  sendEmailEvent.emit('sendEmail', email, otp)
  await OTP.create({email,otp})


  return res.status(201).json({success: true, message: "check ur email for the OTP"})
  
}


export const register = async (req, res, next) => {
  const { userName, email, password, phone, role, otp } = req.body;
  const existOtp = await OTP.findOne({email})
 
  if(!existOtp){
    return next(new Error(messages.otp.notFound, {cause:404}))
  }
  if(existOtp.otp != otp){
    return next(new Error("invalid OTP", {cause:400}))
  }

  const user = await User.create({
    userName,
    email,
    password,
    phone: encypt({ data: phone }),
    role,
  });




  return res.status(201).json({
    success: true,
    message: "user created successfully",
    data: user,
  });
};

export const activateAccount = async (req, res, next) => {
  const token = req.params.token;
  const { id, error } = verifyToken({ token });
  if (error) return next(error);
  const user = await User.findByIdAndUpdate(id, { isConfirmed: true });

  if (!user) {
    return next(new Error("user not found", { cause: 404 }));
  }
  return res.status(200).json({
    success: true,
    message: "account verified successfully🎊. login now",
  });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const existUser = await User.findOne({ email });



  const matched = compare({ data: password, hashedData: existUser.password });
  if (!existUser || !matched) {
    return next(new Error("invalid credentials", { cause: 401 }));
  }
  if (existUser.isDeleted) {
    await User.updateOne({ _id: existUser._id }, { isDeleted: false });
  }

  const accessToken = generateToken({
    payload: { id: existUser._id, email },
    options: { expiresIn: "1d" },
  });
  const refreshToken = generateToken({
    payload: { id: existUser._id, email },
    options: { expiresIn: "7d" },
  });

  return res.status(200).json({
    success: true,
    message: "login successfully",
    accessToken,
    refreshToken,
  });
};

export const refreshToken = async (req, res, next) => {
  const { refreshedToken } = req.body;

  const result = verifyToken({ token: refreshedToken });

  if (result.error) return next(result.error);

  const accessToken = generateToken({
    payload: { email: result.email, id: result.id },
    options: { expiresIn: "1h" },
  });

  return res.status(201).json({success: true, accessToken})
};
