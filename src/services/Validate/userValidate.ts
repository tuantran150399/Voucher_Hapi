import Joi from "Joi";

export const UseridParams = Joi.object({
    id: Joi.string().required().description('the id to find the user')
});


export const userPayload = Joi.object({
    username: Joi.string().alphanum().min(8).max(24).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    email: Joi.string().email().required(),
});