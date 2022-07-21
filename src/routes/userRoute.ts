import { Server } from "@hapi/hapi";
import { userPayload, UseridParams } from "../services/Validate/userValidate";
import {
  createUser,
  getUsers,
  getUserbyId,
  updateUser,
  deleteUser,
} from "../controllers/userControllers";
// import {handleError} from '../services/handleError';
// import Boom from '@hapi/boom';

export const userRoutes = (server: Server) => {
  server.route({
    method: "POST",
    path: "/user",
    options: {
      description: "Add a user ",
      notes: "Add new user",
      tags: ["api"],
      plugins: {
        "hapi-swagger": {
          payloadType: "form",
        },
      },
      validate: {
        payload: userPayload,
        // failAction: handleError
      },
    },
    handler: createUser,
  });

  server.route({
    method: "GET",
    path: "/user/{id}",
    handler: getUserbyId,
    options: {
      description: "Get user with an id",
      notes: "Returns user by id",
      tags: ["api"],
      validate: {
        params: UseridParams,
      },
    },
  });

  server.route({
    method: "GET",
    path: "/users",
    options: {
      description: "Get users list",
      notes: "Returns an array of users",
      tags: ["api"],
    },
    handler: getUsers,
  });

  server.route({
    method: "PUT",
    path: "/user/{id}",
    handler: updateUser,
    options: {
      description: "Edit a user ",
      notes: "Update user",
      tags: ["api"],
      plugins: {
        "hapi-swagger": {
          payloadType: "form",
        },
      },
      validate: {
        params: UseridParams,
        payload: userPayload,
        // failAction: handleError
      },
    },
  });

  server.route({
    method: "DELETE",
    path: "/user/{id}",
    handler: deleteUser,
    options: {
      description: "Delete a user with an id",
      notes: "Delete 1 user in database",
      tags: ["api"],
      validate: {
        params: UseridParams,
        // failAction: handleError
      },
    },
  });
};
