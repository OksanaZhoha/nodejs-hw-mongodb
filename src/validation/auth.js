import Joi from 'joi';
import { emailReg } from '../constans/auth.js';

export const userAddSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().min(3).max(30).required().pattern(emailReg),
  password: Joi.string().min(6).max(20).required(),
});

export const userSigninSchema = Joi.object({
  email: Joi.string().min(3).max(30).required().pattern(emailReg),
  password: Joi.string().min(6).max(20).required(),
});
