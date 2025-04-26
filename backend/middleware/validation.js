import Joi from 'joi';

export const signupSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required()
})

export const signinSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
})

export const verifyVerificationCodeSchema = Joi.object({
    email: Joi.string().required(),
    verificationCode: Joi.number().required()
})