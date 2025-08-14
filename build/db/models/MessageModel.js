"use strict";
// Schema for how the message data is structured in the database
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = require("mongoose");
const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
    conversationId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    images: { type: [String], default: [] },
}, { timestamps: { createdAt: true, updatedAt: false } });
MessageSchema.index({ conversationId: 1, _id: -1 });
exports.Message = mongoose.model('Message', MessageSchema);
//
//# sourceMappingURL=MessageModel.js.map