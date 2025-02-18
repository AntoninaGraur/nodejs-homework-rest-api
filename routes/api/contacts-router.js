import express from "express";

import contactsControllers from "../../controllers/contacts-controllers.js";

import contactsSchemas from "../../schema/contacts-schemas.js";
import { validateBody } from "../../decorators/index.js";
import { isValidId, authenticate} from "../../middlewares/index.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", contactsControllers.getAll);

contactsRouter.get("/:contactId", isValidId, contactsControllers.getById);

contactsRouter.post(
  "/",
  validateBody(contactsSchemas.constactsAddSchema),
  contactsControllers.add
);

contactsRouter.delete(
  "/:contactId",
  isValidId,
  contactsControllers.deleteById
);

contactsRouter.put(
  "/:contactId",
  validateBody(contactsSchemas.constactsAddSchema),
  contactsControllers.updateById
);

contactsRouter.patch(
  "/:contactId/favorite",
  validateBody(
    contactsSchemas.contctsUpdateFavoriteschema,
    contactsControllers.updateFavorite
  )
);

export default contactsRouter;
