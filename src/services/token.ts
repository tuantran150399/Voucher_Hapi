import * as jwt from "jsonwebtoken";
require("dotenv").config();
import { User } from "../models/Users";
export const createToken = async (user: User) => {
  //const key = process.env.SECRET_KEY
  const token = jwt.sign(
    { _id: user._id, username: user.username },
    `${process.env.SECRET_KEY}`,
    { algorithm: "HS256", expiresIn: "1h" }
  );
  return token;
};

export interface decodeJwt {
  _id: string;
  username: string;
  iat: number;
  exp: number;
}
