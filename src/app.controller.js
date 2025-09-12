import dbConnection from "./db/connection.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.contoller.js";
import postRouter from "./modules/post/post.contoller.js";
import commentRouter from "./modules/comment/comment.controller.js";
import adminRouter from "./modules/admin/admin.controller.js"
import { globalError } from "./utils/error/global-error.js";
import { notFound } from "./utils/error/not-found.js";
import cors from "cors"
const bootStrap = async (app, express) => {
  app.use(express.json());
  app.use(cors("*"))
  app.use('/uploads', express.static('uploads'))
  await dbConnection();

  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/post", postRouter)
  app.use("/comment", commentRouter )
  app.use("/admin", adminRouter)

  app.all(/.*/, notFound);
  
  app.use(globalError);
};
export default bootStrap;
