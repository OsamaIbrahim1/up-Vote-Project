import Joi from "joi";
import { generalRules } from "../../utils/general.validation.rule.js";

export const addLikeSchema = {
  body: Joi.object({
    onModel: Joi.string().valid("Product", "Comment", "Reply"),
  }),
  headers: generalRules.headersRules,
  params: Joi.object({
    likeDoneOnId: generalRules.dbId.required(),
  }),
};
export const getUserLikeHistorySchema = {
  headers: generalRules.headersRules,
  query: Joi.object({
    onModel: Joi.string().valid("Product", "Comment", "Reply"),
  }),
};
