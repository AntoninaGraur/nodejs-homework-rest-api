import express from "express";
import { validateBody } from "../../decorators/index.js";
import usersSchemas from "../../schema/users-schemas.js";

import authControllers from "../../controllers/auth-controllers.js";

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


export default authRouter;
