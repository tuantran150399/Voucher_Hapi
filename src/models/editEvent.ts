import { Schema, model } from "mongoose";

export interface EditEvent  {
    eventId: string,
    editable: boolean,
    userEditId: string,
    time: Date
}

const editEventSchema = new Schema({
    eventId: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    editable: {
        type: Boolean,
        required: true
    },
    userEditId: {
        type: Schema.Types.ObjectId
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300
    }
});


export default model<EditEvent>("EditEvent", editEventSchema);