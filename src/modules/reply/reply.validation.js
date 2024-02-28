import Joi from "joi";
import { generalRules } from "../../utils/general.validation.rule.js";

export const addReplySchema = {
  headers: generalRules.headersRules,
  body: Joi.object({
    content: Joi.string().required(),
    onModel: Joi.string().required().valid("Comment", "Reply"),
  }),
  query: Joi.object({
    replyOnId: generalRules.dbId,
  }),
};

export const deleteReplySchema = {
  query: Joi.object({
    replyId: generalRules.dbId,
  }),
  headers: generalRules.headersRules,
};

export const updateReplySchema = {
  body: Joi.object({
    content: Joi.string(),
  }),
  query: Joi.object({
    replyId: generalRules.dbId,
  }),
  headers: generalRules.headersRules,
};

export const likeReplySchema = {
  headers: generalRules.headersRules,
  body: Joi.object({
    onModel: Joi.string().required().valid("Reply"),
  }),
  params: Joi.object({
    replyId: generalRules.dbId,
  }),
};
