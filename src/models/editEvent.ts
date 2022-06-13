import { Schema, model } from "mongoose";

export interface EditEvent  {
    eventId: string,
    editable: boolean,
    userEditId: string,
    time: Date
}

const editEventSchema = new Schema({
    eventId: {
        type: String,
        required: true
    },
    editable: {
        type: Boolean,
        required: true
    },
    userEditId: {
        type: String
    },
    time: {
        type: Date,
        default: Date.now,
        expires: 3000
    }
});


export default model<EditEvent>("EditEvent", editEventSchema);
