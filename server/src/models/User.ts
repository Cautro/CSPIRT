import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password: string;
    role: 'USER' | 'ADMIN';
}

const UserSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'USER' }
});

export const User = model<IUser>('User', UserSchema);
