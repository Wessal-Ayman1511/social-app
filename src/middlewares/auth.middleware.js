import { User } from "../db/models/user.model.js";
import { messages } from "../utils/messages.js/index.js";
import { verifyToken } from "../utils/index.js";

export const isAuthenticated = async (req, res, next) => {
  
    const { authorization } = req.headers;
    if(!authorization)  
      return next(new Error("token is required", {cause:404}))

    if(!authorization.startsWith('Bearer'))
      return next(new Error("invalid bearer key", {cause:404}))

    const token = authorization.split(' ')[1]
    if(!token) return next(new Error("token is required", {cause:404}))
    const result = verifyToken({token}) // wither through error or return payload
    if(result.error) return next(result.error)
    const userExist = await User.findById(result.id);

    if (!userExist) 
      return next(new Error(messages.user.notFound, {cause: 404}))

    if(userExist.isDeleted){
      return next(new Error('account is freezed please login first', {cause:400}))
    }

    if (userExist.deletedAt && userExist.deletedAt.getTime() > result.iat * 1000)
      return next(new Error('destroyed token', {cause:400}))
    req.authUser = userExist;
    next();
}
