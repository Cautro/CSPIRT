import { Schema, model } from 'mongoose';

const NoteSchema = new Schema({
    helper: { type: Schema.Types.ObjectId, ref: 'User' },
    target: { type: Schema.Types.ObjectId, ref: 'User' },
    text: String,
    createdAt: { type: Date, default: Date.now }
});

export const Note = model('Note', NoteSchema);
