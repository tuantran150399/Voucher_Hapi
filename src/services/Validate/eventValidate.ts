import Joi from "Joi";

export const eventIdParams = Joi.object({
    event_id: Joi.string().required().description('the id to find the event')
});

export const eventPayload = Joi.object({
    name: Joi.string().required(),
    maximumVoucher: Joi.number().required()

});