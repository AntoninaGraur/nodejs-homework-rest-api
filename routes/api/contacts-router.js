import express from "express";

import contactsControllers from "../../controllers/contacts-controllers.js";

import contactsSchemas from "../../schema/contacts-schemas.js";
import { validateBody } from "../../decorators/index.js"
import { isValidId, authenticate} from "../../middlewares/index.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", contactsControllers.getAll);

contactsRouter.get("/:id", isValidId, contactsControllers.getById);

contactsRouter.post(
  "/", authenticate, 
  validateBody(contactsSchemas.constactsAddSchema),
  contactsControllers.add
);

contactsRouter.delete(
  "/:id", isValidId,
  validateBody(contactsSchemas.constactsAddSchema),
  contactsControllers.deleteById
);

contactsRouter.put(
  "/:id", isValidId,
  validateBody(contactsSchemas.constactsAddSchema),
  contactsControllers.updateById
);

contactsRouter.patch(
  "/id/favorite", isValidId,
  validateBody(contactsSchemas.contctsUpdateFavoriteschema, contactsControllers.updateFavorite)
);

export default contactsRouter;
