import { Schema, model } from "mongoose";

export interface Event {
    name: string,
    maximumVoucher: number,
    remainVoucher: number
}
//schema format

const eventSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    maximumVoucher: {
        type: Number,
        required: true
    }
    ,
    remainVoucher: {
        type: Number
    }
}, { timestamps: true });


export default model<Event>('Event', eventSchema);
