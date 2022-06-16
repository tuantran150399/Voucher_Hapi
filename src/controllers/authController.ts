import { Request, ResponseToolkit } from "@hapi/hapi";
import { UserRequestInterface } from "../services/Interface/RequestInterface";
import User from "../models/Users";
import Boom from "@hapi/boom";
import { decodeJwt, createToken } from "../services/token";
import { startSession } from "mongoose";
import Event from "../models/Events";
import * as jwt from "jsonwebtoken";
import { commitWithRetry } from "../services/transactions";
import { handleError } from "../services/handleError";
import EditEvent from "../models/EditEvent";
require("dotenv").config();

//login
export const login = async (req: Request, res: ResponseToolkit) => {
  const request = <UserRequestInterface>req;
  //console.log(request.payload.username);
  const user = await User.findOne({ username: request.payload.username });
  const password = request.payload.password;
  if (user) {
    if (password == user.password) {
      const token = await createToken(user);

      return res.response({ token: token, user: user }).code(200);
    } else {
      return Boom.badRequest("Your password is incorrect");
    }
  } else {
    return Boom.notFound("Username is not exist");
  }
};
export const editAbleMe = async (req: Request, res: ResponseToolkit) => {
  const session = await startSession();
  session.startTransaction();
  try {
    const paramsID = req.params.event_id;
    const eventId = await Event.findOne({ _id: paramsID }).exec();
    const decode = <decodeJwt>(
      jwt.verify(req.headers.jwt_token, `${process.env.SECRET_KEY}`)
    );
    if (!decode || !eventId) {
      session.endSession();
      return Boom.badRequest("Input Event Id invalid or Wrong Token");
    } else {
      const findEvent = await EditEvent.findOne({ eventId: paramsID }).exec();
      if (!findEvent) {
        //add new EditEvent if can not find event available

        const newEditEvent = new EditEvent();

        newEditEvent.eventId = paramsID;
        newEditEvent.editable = false;
        newEditEvent.userEditId = decode._id;
        await newEditEvent.save();

        session.endSession();
        return res.response("Allowed").code(200);
        //IF EDITABLE EVENT already have
      } else if (findEvent && findEvent.editable == true) {
        const event = await EditEvent.findOneAndUpdate(
          { eventId: paramsID },
          { editable: false, userEditId: decode._id },
          { session, new: true }
        );
        await commitWithRetry(session);
        session.endSession();
        if (event) {
          return res.response("Allowed").code(200);
        } else {
          return Boom.badRequest("Update tracking failed");
        }
      } else {
        session.endSession();
        return Boom.conflict("Not Allowed - Another user is editting");
      }
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.response(handleError(error));
  }
};

export const editRelease = async (req: Request, res: ResponseToolkit) => {
  const session = await startSession();
  session.startTransaction();
  try {
    const decode = <decodeJwt>(
      jwt.verify(req.headers.jwt_token, `${process.env.SECRET_KEY}`)
    );
    const paramsID = req.params.event_id;
    const findEvent = await EditEvent.findOne({ eventId: paramsID });
    if (!decode || !findEvent) {
      session.endSession();
      return Boom.badRequest("Input Event Id invalid or Wrong Token");
    } else if (findEvent.editable == false) {
      return Boom.badRequest("The Edit event already released");
    }
    const event = await EditEvent.findOneAndUpdate(
      { eventId: paramsID, userEditId: decode._id },
      { editable: true, userEditId: "" },
      { session, new: true }
    );
    await commitWithRetry(session);
    if (event) {
      session.endSession();
      return res.response("Released").code(200);
    } else {
      throw new Error("EDITEVENT Release failed");
    }
  } catch (error) {
    //console.log(error)
    await session.abortTransaction();
    session.endSession();
    res.response(handleError(error));
  }
};
export const editMaintain = async (req: Request, res: ResponseToolkit) => {
  const session = await startSession();
  session.startTransaction();
  try {
    const decode = <decodeJwt>(
      jwt.verify(req.headers.jwt_token, `${process.env.SECRET_KEY}`)
    );
    const paramsID = req.params.event_id;
    const findEvent = await EditEvent.findOne({ eventId: paramsID });
    console.log(findEvent);
    if (!decode || !findEvent) {
      session.endSession();
      return Boom.badRequest("Input Event Id invalid or Wrong Token");
    } else {
      const maintainEvent = await EditEvent.findOneAndUpdate(
        { eventId: paramsID, userEditId: decode._id, editable: false },
        { time: new Date() },
        { session }
      );
      await commitWithRetry(session);
      session.endSession();
      if (maintainEvent) {
        return res
          .response({
            Message: "Maintain editing successfully",
            event: maintainEvent,
          })
          .code(200);
      } else {
        return Boom.badRequest("Maintain editing failed");
      }
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.response(handleError(error)).code(500);
  }
};
