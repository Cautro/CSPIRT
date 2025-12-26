import { Schema, model } from 'mongoose';

const ComplaintSchema = new Schema({
    from: { type: Schema.Types.ObjectId, ref: 'User' },
    to: { type: Schema.Types.ObjectId, ref: 'User' },
    text: String,
    anonymous: Boolean,
    createdAt: { type: Date, default: Date.now }
});

export const Complaint = model('Complaint', ComplaintSchema);
