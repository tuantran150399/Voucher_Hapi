import * as jwt from 'jsonwebtoken';

import {User} from '../models/Users';

export const createToken = async( user: User) => {

    const token = jwt.sign({ _id: user._id, username: user.username }, 'secret', { algorithm: 'HS256', expiresIn: "1h" });
    return token;
  };

export interface decodeJwt {
    _id: string,
    username: string,
    iat: number,
    exp: number

}
