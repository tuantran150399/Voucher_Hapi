import { Request, ResponseToolkit } from '@hapi/hapi';
import Event from '../models/Events';
//add event
export const createEvent = async (req: Request, res: ResponseToolkit) => {
    try {
      const payload = <EventRequestInterface> req.payload;
      const event = new Event(payload);
      await event.save();
      return res.response(event);
    } catch (error) {
      return res.response(error.message).code(500);
    }
  };

//get evnt with id
export const getEventbyID = async (req: Request, res: ResponseToolkit) => {
    try {
      const eventfound = await Event.findById(req.params.event_id);
      if (eventfound) {
        return res.response(eventfound);
      }
      return res.response().code(404);
    } catch (error) {
      res.response(error.message).code(500);
    }
};
//get all Event
export const getEvents = async (req: Request, res: ResponseToolkit) => {
    try {
      const events = await Event.find();
      return res.response(events);
    } catch (error) {
        res.response(error.message).code(500);
    }
};
//delete Event
export const deleteEvent = async (req: Request, res: ResponseToolkit) => {
    try {
      const deleteddEvent = await Event.findByIdAndDelete(req.params.event_id, {
        new: true,
      });
      if (deleteddEvent) {
        return res.response(deleteddEvent);
      }
      return res.response().code(404);
    } catch (error) {
        res.response(error.message).code(500);
    }
};
//Update dont have interface req payload
export const updateEvent = async (req: Request, res: ResponseToolkit) => {
    try {
      const payload = <EventRequestInterface>req.payload;
      const updatedEvent = await Event.findByIdAndUpdate(req.params.event_id, payload, { new: true });
      if (updatedEvent) {
        return res.response(updatedEvent);
      }
      return res.response().code(404);
    } catch (error) {
        res.response(error.message).code(500);
    }
};






//interface joi
interface EventRequestInterface extends Request {
    payload: {
        name: string;
        startTime: Date;
        endTime: Date;
        maxQuantityVoucher: number;
    };
}
