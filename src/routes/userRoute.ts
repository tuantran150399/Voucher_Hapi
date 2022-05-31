import { ResponseToolkit, Server } from '@hapi/hapi';
// import { createUser, getUser, getUsers, deleteUser, updateUser } from "../controlers/userController";
import {userPayload,UseridPrams} from '../services/Validate/userValidate';
import { createUser } from '../controllers/userControllers';

export const userRoutes = (server: Server) => {
    server.route({
        method: 'POST',
        path: '/user',
        options: {
            description: 'Add a user ',
            notes: 'Add new user',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form'
                }
            },
            validate:{
                payload:userPayload
            } 
        },
        handler: createUser
    });

    server.route({
        method: 'GET',
        path: '/user/{id}',
        handler: (request, h) => {
            return "This is a note";
          },
        options: {
            validate: {
                params: UseridPrams
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/users',
        handler: (request, h) => {
            return "This is a note";
          }

    });

    server.route({
        method: 'PUT',
        path: '/user/{id}',
        handler: (request, h) => {
            return "This is a edit user";
          },
        options: {
            validate: {
                params: UseridPrams,
                payload: userPayload,
                // failAction: (request, h:ResponseToolkit, error) => {
                //     return error.isJoi ? h.response(error.message).takeover() : h.response(error.message).takeover();
                // }
            }
        }

    });

    server.route({
        method: 'DELETE',
        path: '/user/{id}',
        handler: (request, h) => {
            return "This is a delete user";
          }

    });
}
