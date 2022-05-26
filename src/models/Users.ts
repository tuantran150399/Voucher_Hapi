import { Schema, model } from "mongoose";

export interface User {
    username: string,
    password: string,
    admin: boolean,
    email: string
}
//User Maybe have image, age, token,...
//schema format
const userSchema: Schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        required: true
    }
}, { timestamps: true });


export default model<User>('User', userSchema);
