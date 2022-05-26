import { Schema, model } from "mongoose";

export interface Voucher {
    code: string,
    expire: boolean
}
//schema format

const voucherSchema: Schema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    expire: {
        type: Boolean,
        required: true
    }
}, { timestamps: true });


export default model<Voucher>('Voucher', voucherSchema);
