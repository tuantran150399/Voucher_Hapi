import { Server } from "@hapi/hapi";
//import {getEventIdParams} from '../services/Validate/voucherValidate';
import {
  getVoucherOfEvent,
  createVoucher,
} from "../controllers/vouControllers";
import { eventIdParams } from "../services/Validate/eventValidate";

export const voucherRoutes = (server: Server) => {
  server.route({
    method: "POST",
    path: "/voucher/{event_id}",
    options: {
      description: "Create a voucher of an event ",
      notes: "Create a voucher of an event by event_id in params",
      tags: ["api"],
      plugins: {
        "hapi-swagger": {
          payloadType: "form",
        },
      },
      validate: {
        params: eventIdParams,
      },
    },
    handler: createVoucher,
  });

  server.route({
    method: "GET",
    path: "/voucher/{event_id}",
    handler: getVoucherOfEvent,
    options: {
      description: "Get vouchers with an event_id",
      notes: "Returns array of vouchers by an id of events",
      tags: ["api"],
      validate: {
        params: eventIdParams,
      },
    },
  });
};
