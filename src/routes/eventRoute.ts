import { Server } from "@hapi/hapi";
import {
  eventPayload,
  eventIdParams,
} from "../services/Validate/eventValidate";
import {
  createEvent,
  getEventByID,
  getEvents,
  deleteEvent,
  updateEvent,
} from "../controllers/eventControllers";
export const eventRoutes = (server: Server) => {
  server.route({
    method: "POST",
    path: "/event",
    options: {
      description: "Add an event ",
      notes: "Add new event",
      tags: ["api"],
      plugins: {
        "hapi-swagger": {
          payloadType: "form",
        },
      },
      validate: {
        payload: eventPayload,
        // failAction: handleError
      },
    },
    handler: createEvent,
  });

  server.route({
    method: "GET",
    path: "/event/{event_id}",
    handler: getEventByID,
    options: {
      description: "Get an event with an id",
      notes: "Returns event by id",
      tags: ["api"],
      validate: {
        params: eventIdParams,
      },
    },
  });

  server.route({
    method: "GET",
    path: "/events",
    options: {
      description: "Get events list",
      notes: "Returns an array of events",
      tags: ["api"],
    },
    handler: getEvents,
  });

  server.route({
    method: "PUT",
    path: "/event/{id}",
    handler: updateEvent,
    options: {
      description: "Edit an event ",
      notes: "Update event",
      tags: ["api"],
      plugins: {
        "hapi-swagger": {
          payloadType: "form",
        },
      },
      validate: {
        params: eventIdParams,
        payload: eventPayload,
      },
    },
  });

  server.route({
    method: "DELETE",
    path: "/event/{id}",
    handler: deleteEvent,
    options: {
      description: "Delete an event with an id",
      notes: "Delete 1 event in database",
      tags: ["api"],
      validate: {
        params: eventIdParams,
        // failAction: handleError
      },
    },
  });
};
