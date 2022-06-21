import Joi from "Joi";

export const getEventIdParams = Joi.object({
  event_id: Joi.string()
    .required()
    .description("the id of event want to generate voucher"),
});
