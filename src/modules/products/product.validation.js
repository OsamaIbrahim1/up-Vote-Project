import Joi from "joi";
import { generalRules } from "../../utils/general.validation.rule.js";

export const addProductSchema = {
  body: Joi.object({
    title: Joi.string().required(),
    caption: Joi.string().default("no caption"),
  }),
  headers: generalRules.headersRules,
};
export const updateProductSchema = {
  body: Joi.object({
    title: Joi.string(),
    caption: Joi.string().default("no caption"),
    oldPublicId: Joi.string().required(),
  }),
  query: Joi.object({
    productId: generalRules.dbId,
  }),
  headers: generalRules.headersRules,
};

export const deleteProductSchema = {
  query: Joi.object({
    productId: generalRules.dbId,
  }),
  headers: generalRules.headersRules,
};

export const likeProductSchema = {
  query: Joi.object({
    productId: generalRules.dbId,
  }),
  headers: generalRules.headersRules,
  body: Joi.object({
    onModel: Joi.string().valid("Product"),
  }),
};

export const getAllProductsSchema = {
  headers: generalRules.headersRules,
};

export const getAllLikesForProductSchema = {
  query: Joi.object({
    productId: generalRules.dbId,
  }),
  headers: generalRules.headersRules,
}
export const getProductSchema = {
  query: Joi.object({
    productId: generalRules.dbId,
  }),
  headers: generalRules.headersRules,
};
