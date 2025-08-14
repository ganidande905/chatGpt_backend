"use strict";
// Schema for how the conversation data is structured in the database
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conversation = void 0;
const mongoose = require('mongoose');
const ConverstationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, default: "New Chat" },
    model: { type: String, required: true },
}, { timestamps: true });
ConverstationSchema.index({ userId: 1, updatedAt: -1 });
exports.Conversation = mongoose.model('Conversation', ConverstationSchema);
// This is more like a schmea on how your data is structured in the database, well every schema is almost the same format,
//  just had the change in the fields and the type of data you are storing
// Inspired from  https://mongoosejs.com/docs/guide.html : a very good documentation i'd say
//# sourceMappingURL=ConversationModel.js.map