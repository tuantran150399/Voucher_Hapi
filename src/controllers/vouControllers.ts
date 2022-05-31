import { Request, ResponseToolkit } from '@hapi/hapi';
import Voucher from '../models/Vouchers';

  

export const randomCode= (length: Number): string => {
    let result           = 'Vou';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
