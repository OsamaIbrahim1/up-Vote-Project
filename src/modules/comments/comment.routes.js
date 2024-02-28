import { Router } from "express";
import expressAsyncHandler from "express-async-handler";

import * as commentController from "./comment.controller.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";

import { systemRoles } from "../../utils/systemRoles.js";
import { auth } from "../../middlewares/auth.middleware.js";
import * as commentValdation from "./comment.validation.js";

const router = Router();

router.post(
  "/addComment",
  auth([systemRoles.ADMIN, systemRoles.USER]),
  validationMiddleware(commentValdation.addCommentSchema),
  expressAsyncHandler(commentController.addComment)
);

router.delete(
  "/deleteComment",
  auth([systemRoles.ADMIN, systemRoles.USER]),
  validationMiddleware(commentValdation.deleteCommentSchema),
  expressAsyncHandler(commentController.deleteComment)
);

router.put(
  "/updateComment",
  auth([systemRoles.ADMIN, systemRoles.USER]),
  validationMiddleware(commentValdation.updateCommentSchema),
  expressAsyncHandler(commentController.updateComment)
);

router.post(
  "/likeComment/:commentId",
  auth([systemRoles.USER, systemRoles.ADMIN]),
  validationMiddleware(commentValdation.likeCommentSchema),
  expressAsyncHandler(commentController.likeComment)
);

export default router;
