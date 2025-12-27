import { Schema, model, Document } from 'mongoose';

export interface IUser {
    username: string
    password: string
    role: 'user' | 'helper' | 'admin' | 'owner'
    rating: number
}



const UserSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['user', 'helper', 'admin', 'owner'],
        default: 'user',
        required: true,
    },
    rating: { type: Number, default: 100 }
});

export const User = model<IUser>('User', UserSchema);
