// Schema for how the message data is structured in the database

import { Schema } from "mongoose";

const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    conversationId:{type: Schema.Types.ObjectId, ref: 'Conversation', required: true},
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: {type:String, required: true},
    images: {type:[String], default: []},
},{timestamps:{createdAt: true, updatedAt:false}});

MessageSchema.index({ conversationId: 1, _id: -1 });
export const Message = mongoose.model('Message', MessageSchema);

