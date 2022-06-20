import { Request, ResponseToolkit } from "@hapi/hapi";
import Voucher from "../models/Vouchers";
import { startSession } from "mongoose";
import Event from "../models/Events";
import moment from "moment";
import { commitWithRetry } from "../services/transactions";
import Boom from "@hapi/boom";
import { handleError } from "../services/handleError";
import { voucherNotify } from "../services/emailHandler";

export const randomCode = (length: Number): string => {
  let result = "Vou";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const createVoucher = async (req: Request, res: ResponseToolkit) => {
  const session = await startSession();
  session.startTransaction();
  try {
    //check event available

    const eventUpdate2 = await Event.findOneAndUpdate(
      { _id: req.params.event_id },
      { $inc: { remainVoucher: -1 } },
      { session: session, new: true }
    );

    if (eventUpdate2) {
      if (eventUpdate2?.remainVoucher >= 0) {
        //Create Voucher content

        const expireTime = moment().add(7, "days").format("L");
        const codeVoucher = randomCode(6);

        //create voucher
        // const voucher = new Voucher({
        //   code: codeVoucher,
        //   event_id: eventUpdate2._id,
        //   expire: expireTime,
        // });
        
        const voucherSave = await Voucher.create(
          [
            {
              code: codeVoucher,
              event_id: eventUpdate2._id,
              expire: expireTime,
            },
          ],
          { session: session }
        );
        //const voucherSave = await voucher.save();
        //add code voucher into mail queue
        await voucherNotify(codeVoucher);
        await commitWithRetry(session);
        console.log(voucherSave);
        return res
          .response({
            voucher: voucherSave,
            eventInfo: eventUpdate2,
          })
          .code(200);
      } else {
        return Boom.badRequest("Vouchers are sold out");
      }
    } else {
      // not test
      return Boom.badRequest("Event not available");
    }
  } catch (error) {
    console.log("Caught exception during transaction, aborting.");
    await session.abortTransaction();
    res.response(handleError(error)).code(500);
  } finally {
    session?.endSession();
    console.log("end here");
  }
};

export const getVoucherOfEvent = async (req: Request, res: ResponseToolkit) => {
  const session = await startSession();
  session.startTransaction();
  try {
    const vouchers = await Voucher.find({ event_id: req.params.event_id });
    return res.response(vouchers);
  } catch (error) {
    res.response(handleError(error)).code(500);
  }
};
