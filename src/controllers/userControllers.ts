import { Request, ResponseToolkit } from '@hapi/hapi';
import User from '../models/Users';

export const createUser = async (req: Request, res: ResponseToolkit) => {
    try {
      const user = new User(req.payload);
      const userSaved = await user.save();
      return res.response(userSaved);
    } catch (error) {
        if (typeof error === "string") {
            return res.response(error.toUpperCase()).code(500);
        } else if (error instanceof Error) {
            return res.response(error.message).code(500);
        }
        return res.response('error').code(500); //TODO
    }

  };
  