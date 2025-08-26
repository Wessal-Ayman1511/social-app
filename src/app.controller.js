import dbConnection from "./db/connection.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.contoller.js";
import { globalError } from "./utils/error/global-error.js";
import { notFound } from "./utils/error/not-found.js";
const bootStrap = async (app, express) => {
  app.use(express.json());
  await dbConnection();
  app.get('/test', (req, res) => {
    return res.json({message: "welcome"})
  })

  app.use("/auth", authRouter);
  app.use("/user", userRouter);

  app.all(/.*/, notFound);
  
  app.use(globalError);
};
export default bootStrap;
