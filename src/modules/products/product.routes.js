import { Router } from "express";
import expressAsyncHandler from "express-async-handler";

import * as productController from "./product.controller.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";

import { systemRoles } from "../../utils/systemRoles.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { multerMiddleHost } from "../../middlewares/multer.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import * as productValidation from "./product.validation.js";

const router = Router();

router.post(
  "/addProduct",
  auth([systemRoles.ADMIN, systemRoles.USER]),
  multerMiddleHost({ extensions: allowedExtensions.image }).array("image", 3),
  validationMiddleware(productValidation.addProductSchema),
  expressAsyncHandler(productController.addProduct)
);

router.put(
  "/updateProduct",
  auth([systemRoles.ADMIN, systemRoles.USER]),
  multerMiddleHost({ extensions: allowedExtensions.image }).single("image"),
  validationMiddleware(productValidation.updateProductSchema),
  expressAsyncHandler(productController.updateProduct)
);

router.delete(
  "/deleteProduct",
  auth([systemRoles.ADMIN, systemRoles.USER]),
  validationMiddleware(productValidation.deleteProductSchema),
  expressAsyncHandler(productController.deleteProduct)
);

router.post(
  "/likeProduct",
  auth([systemRoles.ADMIN, systemRoles.USER]),
  validationMiddleware(productValidation.likeProductSchema),
  expressAsyncHandler(productController.likeProduct)
);

router.get(
  "/getAllProducts",
  auth([systemRoles.ADMIN, systemRoles.USER]),
  validationMiddleware(productValidation.getAllProductsSchema),
  expressAsyncHandler(productController.getAllProducts)
);

router.get(
  "/getAllLikesForProduct",
  auth([systemRoles.ADMIN, systemRoles.USER]),
  validationMiddleware(productValidation.getAllLikesForProductSchema),
  expressAsyncHandler(productController.getAllLikesForProduct)
);

router.get(
  "/getProduct",
  auth([systemRoles.ADMIN, systemRoles.USER]),
  validationMiddleware(productValidation.getProductSchema),
  expressAsyncHandler(productController.getProduct)
);

export default router;
