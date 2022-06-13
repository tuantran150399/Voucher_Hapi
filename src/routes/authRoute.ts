import { Server } from '@hapi/hapi';
import {login,editAbleMe, editRelease,editMaintain} from '../controllers/authController';
import {userLogin} from '../services/Validate/userValidate';
import {headerEventToken,eventIdParams} from '../services/Validate/eventValidate';

export const authRoutes = (server:Server) =>{
     server.route({
        method: 'POST',
        path:'/login',
        options: {
            description: 'User Login ',
            notes: 'Login and generate token jwt',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form'
                }
            },
            validate:{
                payload: userLogin,
                // failAction: handleError
            } 
        },
        handler:login

     });
     server.route({
        method: 'POST',
        path: '/events/{event_id}/editable/me',
        options: {
          description: 'API will check if that event is still editable',
          notes: 'mark the current editing user',
          tags: ['api'],
          validate: {
            params: eventIdParams,
            headers: headerEventToken,
          },
        },
        handler: editAbleMe
      });

      server.route({
        method: 'POST',
        path: '/events/{event_id}/editable/release',
        options: {
          description: 'Allows to release editable Event of the current user',
          notes: ' other users can open it to edit after release',
          tags: ['api'], // ADD THIS TAG
          validate: {
            params: eventIdParams,
          },
        },
        handler: editRelease
      });
      server.route({
        method: 'POST',
        path: '/events/{event_id}/editable/maintain',
        options: {
          description: 'Maintain time editing of user',
          notes: 'Maintain by event id in path and token of user',
          tags: ['api'], // ADD THIS TAG
          validate: {
            params: eventIdParams,
            headers: headerEventToken
          },
        },
        handler: editMaintain
      });
    

    
}