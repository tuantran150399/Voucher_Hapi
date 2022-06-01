import { ResponseToolkit, Server } from '@hapi/hapi';
// import { createUser, getUser, getUsers, deleteUser, updateUser } from "../controlers/userController";
import {userPayload,UseridPrams} from '../services/Validate/userValidate';
import { createUser,getUsers,getUserId,updateUser,deleteUser } from '../controllers/userControllers';
// import {handleError} from '../services/handleError';
// import Boom from '@hapi/boom';

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
                payload:userPayload,
                // failAction: handleError
            } 
        },
        handler: createUser
    });

    server.route({
        method: 'GET',
        path: '/user/{id}',
        handler: getUserId,
        options: {
            description: 'Get user with an id',
            notes: 'Returns user by id',
            tags: ['api'],
            validate: {
                params: UseridPrams,
                // failAction: (request, res:ResponseToolkit , err) => {
                //     console.log(err)
                //     throw Boom.badRequest(`Invalid request input`);
                //     // const source = err.output.payload.validation?.source
                //     // request.log(['validation', 'error', source], err.message);
                //     // throw Boom.badRequest(`Invalid request ${source} input`);
                // }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/users',
        options: {
            description: 'Get users list',
            notes: 'Returns an array of users',
            tags: ['api']
        },
        handler: getUsers

    });

    server.route({
        method: 'PUT',
        path: '/user/{id}',
        handler: updateUser,
        options: {
            description: 'Edit a user ',
            notes: 'Update user',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form'
                }
            },
            validate: {
                params: UseridPrams,
                payload: userPayload,
                // failAction: handleError
            }
        }

    });

    server.route({
        method: 'DELETE',
        path: '/user/{id}',
        handler:deleteUser,
        options: {
            description: 'Delete a user with an id',
            notes: 'Delete 1 user in database',
            tags: ['api'],
            validate: {
                params: UseridPrams,
                // failAction: handleError
            }
        }
    });
}
