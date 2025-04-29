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

export const forgotPasswordCodeSchema = Joi.object({
    email: Joi.string().required(),
    verificationCode: Joi.number().required(),
    newPassword: Joi.string().required()
})

export const changePasswordSchema = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required()
})