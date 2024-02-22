import Joi from "joi";
import { systemRoles } from "../../utils/systemRoles.js";
import { generalRules } from "../../utils/general.validation.rule.js";

export const signUpSchema = {
  body: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().min(3).max(20).trim().lowercase().required(),
    email: Joi.string().trim().lowercase().required().email(),
    password: Joi.string().min(6).required(),
    role: Joi.string()
      .valid(systemRoles.ADMIN, systemRoles.USER)
      .default(systemRoles.USER),
    age: Joi.number().min(18).max(100).required(),
    gender: Joi.string().valid("femail", "male").default("male"),
  }),
};

export const verifyEmailSchema = {
  query: Joi.object({
    token: Joi.string().required(),
  }),
};

export const signInSchema = {
  body: Joi.object({
    email: Joi.string().trim().lowercase().required().email(),
    password: Joi.string().min(6).required(),
  }),
};

export const updateAccountSchema = {
  body: Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    username: Joi.string().min(3).max(20).trim().lowercase(),
    email: Joi.string().trim().lowercase().email(),
    role: Joi.string().valid(systemRoles.ADMIN, systemRoles.USER),
    age: Joi.number().min(18).max(100),
    gender: Joi.string().valid("female", "male"),
  }),
  headers: generalRules.headersRules,
};

export const deleteAccountSchema = {
  headers: generalRules.headersRules,
};
export const getUserProfileSchema = {
  headers: generalRules.headersRules,
};
