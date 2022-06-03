import { Request, ResponseToolkit } from '@hapi/hapi';
import Event from '../models/Events';
import {EventRequestInterface } from '../services/Interface/RequestInterface'
import {handleError} from '../services/handleError';

//add event
export const createEvent = async (req: Request, res: ResponseToolkit) => {
    try {
      const payload = <EventRequestInterface> req.payload;
      
      const event = new Event(payload);
      event.remainVoucher = event.maximumVoucher;
      //console.log(event)
      await event.save();
      return res.response(event);
    } catch (error) {
      res.response(handleError(error)).code(500);
    }
  };

//get evnt with id
export const getEventbyID = async (req: Request, res: ResponseToolkit) => {
    try {
      const event = await Event.findById(req.params.event_id);
      if (event) {
        return res.response(event);
      }
    } catch (error) {
      res.response(handleError(error)).code(500);
    }
};
//get all Event
export const getEvents = async (req: Request, res: ResponseToolkit) => {
    try {
      const events = await Event.find();
      return res.response(events);
    } catch (error) {
      res.response(handleError(error)).code(500);
    }
};
//delete Event
export const deleteEvent = async (req: Request, res: ResponseToolkit) => {
    try {
      const event = await Event.findByIdAndDelete(req.params.event_id);
      if (event) {
        return res.response(event);
      }
    } catch (error) {
      res.response(handleError(error)).code(500);
    }
};
//Update dont have interface req payload
export const updateEvent = async (req: Request, res: ResponseToolkit) => {
    try {
      const payload = <EventRequestInterface>req.payload;
      const event = await Event.findByIdAndUpdate(req.params.event_id, payload, { new: true });
      if (event) {
        return res.response(event);
      }
    } catch (error) {
      res.response(handleError(error)).code(500);
    }
};







