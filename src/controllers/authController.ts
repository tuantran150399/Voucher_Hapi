import { Request, ResponseToolkit } from '@hapi/hapi';
import {UserRequestInterface } from '../services/Interface/RequestInterface';
import User from '../models/Users';
import Boom from '@hapi/boom';
import {decodeJwt,createToken} from '../services/token';
import { startSession } from "mongoose"
import Event from '../models/Events'
import * as jwt from 'jsonwebtoken';
import {commitWithRetry} from '../services/transactions';
import {handleError} from '../services/handleError';
import editEvent from '../models/editEvent';
//login
export const login = async (req: Request, res: ResponseToolkit) => {
      const request = <UserRequestInterface> req;
      //console.log(request.payload.username);
      const user = await User.findOne({ username: request.payload.username });
      const password = request.payload.password;
      if(user){
          if(password ==user.password){
              const token = await createToken(user)
              //console.log(token)
              return res.response({ token: token, user:user }).code(200);
          }else{
            return Boom.badRequest('Your password is incorrect');
          }
      }
      else{
        return Boom.notFound('Username is not exist');
      };
  };
export const editAbleMe = async (req: Request, res: ResponseToolkit) => {
    const session = await startSession();
    //console.log(session)
    try{
      session.startTransaction();
      const paramsID = req.params.event_id;
      const eventId = await Event.findOne({_id: paramsID}).exec();
      const decode = <decodeJwt>jwt.verify(req.headers.jwt_token, 'secret'); //catch error here
      console.log(decode)
      if(!decode || !eventId )
      {
        session.endSession();
        return Boom.badRequest('Input Event Id invalid or Wrong Token');
      }else{
        const findEvent = await editEvent.findOne({eventId: paramsID}).exec();
        //console.log(findEvent)
        //if((findEvent && findEvent.editable == true) || (!findEvent)){
        if(!findEvent){
          
          const newEditEvent = new editEvent();
          newEditEvent.eventId = paramsID;
          newEditEvent.editable = false;
          newEditEvent.userEditId = decode._id;
          await newEditEvent.save();
          session.endSession();
          return res.response('Allowed').code(200);
        }
        else if(findEvent && findEvent.editable == true){
          console.log('abc')
          await commitWithRetry(session);
          const event = await editEvent.findOneAndUpdate(
            {eventId: paramsID},
            {editable:false,userEditId:decode._id},
            { session,new: true}) ;
            console.log(event);
            if(event){
              session.endSession();
              return res.response('Allowed').code(200);
            }else{
              session.endSession();
              return Boom.badRequest('Update tracking failed');
            }
            // session.endSession();
            // return res.response('Allowed').code(200);
        }else{
          session.endSession();
          return Boom.conflict('Not Allowed - Another user is editting');

        }

      }
    } catch (e) {
      await session.abortTransaction();
      session.endSession();
      return Boom.badImplementation('terrible implementation');
    }
  };


export const editRelease = async (req: Request, res: ResponseToolkit) => {
    const session = await startSession();
    try {
      session.startTransaction();
      const paramsID = req.params.event_id;
      await commitWithRetry(session);
      const event = await editEvent.findOneAndUpdate({eventId: paramsID,},
      {editable:true, userEditId: ''},
      { session,new: true}) ;
      console.log(event)
      session.endSession();
      return res.response('Released').code(200);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return Boom.badImplementation('terrible implementation', { statusCode: 500 });
    }
};//(error, { statusCode: 456 })
export const editMaintain = async (req: Request, res: ResponseToolkit) => {
  const session = await startSession();
  try {
    const paramsID = req.params.event_id;
    const findEvent = await editEvent.findOne({eventId: paramsID}).exec();
    session.startTransaction();
    if (findEvent) {
      await commitWithRetry(session);
      const maintainEvent = await editEvent.findOneAndUpdate(
        { eventId: paramsID},
        { time: new Date() },
        { session },
      );
      session.endSession();
      if(maintainEvent){
        return res.response({Message:'Maintain editing successfully'
        ,event:maintainEvent}).code(200);
      }
      else{
        return Boom.badRequest('Maintain editing failed');
      }
    } else {
      throw Boom.badRequest('Event not found');
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.response(handleError(error)).code(500);
  }
};
