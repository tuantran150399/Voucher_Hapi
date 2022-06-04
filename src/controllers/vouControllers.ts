import { Request, ResponseToolkit } from '@hapi/hapi';
import Voucher from '../models/Vouchers';
import { startSession } from "mongoose"
import Event from '../models/Events';
import moment from 'moment';
import {commitWithRetry} from '../services/transactions';
import Boom from '@hapi/boom';
import {handleError} from '../services/handleError';
import {voucherNotify} from '../services/emailHandler';
import { etherealMailer } from "../services/mailer";

export const randomCode= (length: Number): string => {
    let result           = 'Vou';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

export const createVoucher = async (req: Request, res: ResponseToolkit) => {
   const session = await startSession();
   session.startTransaction();
   
   //session.startTransaction( { readConcern: { level: "snapshot" }, writeConcern: { w: "majority" } } );
   try{
      //check event available
         await commitWithRetry(session);
         const event = await Event.findById(req.params.event_id);
         console.log(event)
         if(event){
            if(event.remainVoucher>0){
               const expireTime = moment().add(7, 'days').format('L')
               const codeVoucher = randomCode(6);
               await voucherNotify(codeVoucher);
               //await etherealMailer(codeVoucher);
               const voucher = new Voucher({code: codeVoucher,event_id: event._id, expire:expireTime   });
               const voucherSave = await voucher.save();
               
               const eventUpdate2 =  await  Event.findOneAndUpdate(
                  {_id: req.params.event_id  },
                  {$inc: { remainVoucher: -1 }},
                  {session, new: true}
               );
               session.endSession(); // not test
               console.log(req.params.event_id)
               console.log(eventUpdate2)
               return res.response({
                  code: voucherSave.code,
                  eventVoucher: voucherSave.event_id,
                  eventInfo: eventUpdate2
               }).code(200);
            }else{
               session.endSession();// not test
               var error = new Error('Vouchers are sold out');
               return Boom.boomify(error, { statusCode: 456 });
            }
         }else{
            session.endSession(); // not test
            var error = new Error('Event not available');
            return Boom.boomify(error, { statusCode: 456 });
         }
   }catch(error){
      await session.abortTransaction();
      res.response(handleError(error)).code(500);
   }

}

export const getVoucherOfEvent = async (req: Request, res: ResponseToolkit) => {
   try {
     const vouchers = await Voucher.find({ event_id: req.params.event_id });
     return res.response(vouchers);
   } catch (error) {
     res.response(handleError(error)).code(500);
   }
 };
 