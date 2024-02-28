import { Router } from "express";
import expressAsyncHandler from "express-async-handler";

import * as replyController from "./reply.controller.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";

import { systemRoles } from "../../utils/systemRoles.js";
import { auth } from "../../middlewares/auth.middleware.js";
import * as replyValdation from "./reply.validation.js";

const router = Router();

router.post(
  "/addReply",
  auth([systemRoles.ADMIN, systemRoles.USER]),
  validationMiddleware(replyValdation.addReplySchema),
  expressAsyncHandler(replyController.addReply)
);

router.delete(
  "/deleteReply",
  auth([systemRoles.ADMIN, systemRoles.USER]),
  validationMiddleware(replyValdation.deleteReplySchema),
  expressAsyncHandler(replyController.deleteReply)
);
router.put(
  "/updateReply",
  auth([systemRoles.ADMIN, systemRoles.USER]),
  validationMiddleware(replyValdation.updateReplySchema),
  expressAsyncHandler(replyController.updateReply)
);

router.post(
  "/likeReply/:replyId",
  auth([systemRoles.ADMIN, systemRoles.USER]),
  validationMiddleware(replyValdation.likeReplySchema),
  expressAsyncHandler(replyController.likeReply)
);

export default router;
