import express from "express";
import { validateBody } from "../../decorators/index.js";
import usersSchemas from "../../schema/users-schemas.js";

import authControllers from "../../controllers/auth-controllers.js";
import { authenticate, upload } from "../../middlewares/index.js"; 

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(usersSchemas.userRegisterSchema),
  authControllers.register
);

authRouter.post(
  "/login",
  validateBody(usersSchemas.userLoginSchema),
  authControllers.login
);
 
authRouter.get("/current", authenticate, authControllers.getCurrent);

authRouter.post("/logout", authenticate, authControllers.logout);

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  authControllers.updateAvatar
);

authRouter.get("/verify/:verificatinCode", authControllers.verify);

authRouter.post("/verify", validateBody(usersSchemas.emailSchema), authControllers.resendVerifyEmail);

export default authRouter;
