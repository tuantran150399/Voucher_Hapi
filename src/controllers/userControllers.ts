import { Request, ResponseToolkit } from "@hapi/hapi";
import User from "../models/Users";
import { UserRequestInterface } from "../services/Interface/RequestInterface";
import { handleError } from "../services/handleError";

export const createUser = async (req: Request, res: ResponseToolkit) => {
  try {
    const user = new User(req.payload);
    const userSaved = await user.save();
    return res.response(userSaved);
  } catch (error) {
    res.response(handleError(error)).code(500);
  }
};
export const getUsers = async (req: Request, res: ResponseToolkit) => {
  try {
    const users = await User.find().exec();
    return res.response(users);
  } catch (error) {
    handleError(error);
  }
};

export const getUserbyId = async (req: Request, res: ResponseToolkit) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      return res.response(user);
    }
  } catch (error) {
    return handleError(error);
  }
};

export const updateUser = async (req: Request, res: ResponseToolkit) => {
  try {
    const payload: Request = <UserRequestInterface>req.payload;
    const user = await User.findByIdAndUpdate(req.params.id, payload, {
      new: true,
    });
    if (user) {
      return res.response(user);
    }
  } catch (error) {
    res.response(handleError(error)).code(500);
  }
};
export const deleteUser = async (req: Request, res: ResponseToolkit) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) {
      return res.response(user);
    }
  } catch (error) {
    res.response(handleError(error)).code(500);
  }
};
