import { Router } from "express";
import expressAsyncHandler from "express-async-handler";

import * as likeController from "./like.controller.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import * as likesValidation from "./like.validation.js";

import { systemRoles } from "../../utils/systemRoles.js";
import { auth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/addLike/:likeDoneOnId",
  auth(systemRoles.USER, systemRoles.ADMIN),
  validationMiddleware(likesValidation.addLikeSchema),
  expressAsyncHandler(likeController.addLike)
);
router.get(
  "/getUserLikeHistory",
  auth(systemRoles.USER, systemRoles.ADMIN),
  validationMiddleware(likesValidation.getUserLikeHistorySchema),
  expressAsyncHandler(likeController.getUserLikeHistory)
);

export default router;
