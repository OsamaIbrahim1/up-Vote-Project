import Joi from "joi";
import { generalRules } from "../../utils/general.validation.rule.js";

export const addCommentSchema = {
  body: Joi.object({
    content: Joi.string().required(),
  }),
  query: Joi.object({
    productId: generalRules.dbId,
  }),
  headers: generalRules.headersRules,
};
export const deleteCommentSchema = {
  query: Joi.object({
    commentId: generalRules.dbId,
  }),
  headers: generalRules.headersRules,
};

export const updateCommentSchema = {
  query: Joi.object({
    commentId: generalRules.dbId,
  }),
  headers: generalRules.headersRules,
  body: Joi.object({
    content: Joi.string(),
  }),
};

export const likeCommentSchema = {
  params: Joi.object({
    commentId: generalRules.dbId,
  }),
  headers: generalRules.headersRules,
  body: Joi.object({
    onModel: Joi.string().required().valid('Comment'),
  }),
};
