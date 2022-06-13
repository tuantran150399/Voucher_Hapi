import { Schema, model, Document } from "mongoose";

export interface Event extends Document {
    name: string,
    maximumVoucher: number,
    remainVoucher: Number
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
