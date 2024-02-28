import { Router } from "express";
import expressAsyncHandler from "express-async-handler";

import * as userController from "./user.controller.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import {
  deleteAccountSchema,
  getUserProfileSchema,
  signInSchema,
  signUpSchema,
  updateAccountSchema,
  verifyEmailSchema,
} from "./user.validation.js";
import { systemRoles } from "../../utils/systemRoles.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { multerMiddleHost } from "../../middlewares/multer.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";

const router = Router();

router.post(
  "/signUp",
  validationMiddleware(signUpSchema),
  expressAsyncHandler(userController.signUp)
);

router.get(
  "/verify-email",
  validationMiddleware(verifyEmailSchema),
  expressAsyncHandler(userController.verifyEmail)
);

router.post(
  "/signIn",
  validationMiddleware(signInSchema),
  expressAsyncHandler(userController.signIn)
);

router.put(
  "/updateAccount",
  auth([systemRoles.USER, systemRoles.ADMIN]),
  validationMiddleware(updateAccountSchema),
  expressAsyncHandler(userController.updateAccount)
);

router.delete(
  "/deleteAccount",
  auth([systemRoles.USER, systemRoles.ADMIN]),
  validationMiddleware(deleteAccountSchema),
  expressAsyncHandler(userController.deleteAccount)
);

router.get(
  "/getUserProfile",
  auth([systemRoles.USER, systemRoles.ADMIN]),
  validationMiddleware(getUserProfileSchema),
  expressAsyncHandler(userController.getUserProfile)
);

router.post(
  "/uploadImage",
  auth([systemRoles.USER, systemRoles.ADMIN]),
  multerMiddleHost({ extensions: allowedExtensions.image }).single("image"),
  expressAsyncHandler(userController.uploadImage)
);

export default router;
