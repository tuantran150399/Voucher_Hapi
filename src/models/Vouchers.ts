import { Schema, model } from "mongoose";

export interface Voucher {
    code: string,
    expire: boolean,
    event_id:String
}
//schema format

const voucherSchema: Schema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },event_id: {
        type: String,
        required: true
    },
    expire: {
        type: String,
        required: true
    }
}, { timestamps: true });


export default model<Voucher>('Voucher', voucherSchema);
