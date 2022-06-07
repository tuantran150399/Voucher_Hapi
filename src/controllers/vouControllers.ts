import { Request, ResponseToolkit } from '@hapi/hapi';
import Voucher from '../models/Vouchers';
import { startSession } from "mongoose"
import Event from '../models/Events';
import moment from 'moment';
import {commitWithRetry} from '../services/transactions';
import Boom from '@hapi/boom';
import {handleError} from '../services/handleError';
import {voucherNotify} from '../services/emailHandler';

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
         const eventUpdate2 =  await  Event.findOneAndUpdate(
            {_id: req.params.event_id  },
            {$inc: { remainVoucher: -1 }},
            {session, new: true}
         );
         if(eventUpdate2){
            if(eventUpdate2?.remainVoucher>0){
               //Create Voucher content
               const expireTime = moment().add(7, 'days').format('L')
               const codeVoucher = randomCode(6);
               //create voucher
               const voucher = new Voucher({code: codeVoucher,event_id: eventUpdate2._id, expire:expireTime   });
               const voucherSave = await voucher.save();
               //add code voucher into mail queue
               await voucherNotify(codeVoucher);
               session.endSession(); // not test
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
 