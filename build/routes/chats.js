"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ConversationModel_1 = require("../db/models/ConversationModel");
const MessageModel_1 = require("../db/models/MessageModel");
const chatsRouter = (0, express_1.Router)();
chatsRouter.post("/chats", async (req, res) => {
    const { userId, title, model } = req.body || {};
    if (!userId || !model)
        return res.status(400).json({ error: "userId and model are required" });
    const convo = await ConversationModel_1.Conversation.create({
        userId,
        title: title ?? "New Chat",
        model
    });
    res.json({
        id: String(convo._id),
        title: convo.title,
        model: convo.model,
        createdAt: convo.createdAt,
        updatedAt: convo.updatedAt
    });
});
chatsRouter.get("/chats", async (req, res) => {
    const { userId } = req.query;
    if (!userId)
        return res.status(400).json({ error: "userId is required" });
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const cursor = req.query.cursor;
    const crit = { userId };
    if (cursor)
        crit.updatedAt = { $lt: new Date(cursor) };
    const rows = await ConversationModel_1.Conversation.find(crit).sort({ updatedAt: -1 }).limit(limit + 1).lean();
    const hasMore = rows.length > limit;
    const data = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor = hasMore ? data[data.length - 1].updatedAt : null;
    res.json({
        data,
        nextCursor
    });
});
chatsRouter.get("/chats/:id/messages", async (req, res) => {
    const { id } = req.params;
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const cursor = req.query.cursor; // last seen _id (descending paging)
    const crit = { conversationId: id };
    if (cursor)
        crit._id = { $lt: cursor };
    const rows = await MessageModel_1.Message.find(crit).sort({ _id: -1 }).limit(limit + 1).lean();
    const hasMore = rows.length > limit;
    const chunk = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor = hasMore ? String(chunk[chunk.length - 1]._id) : null;
    chunk.reverse(); // oldest first for UI
    res.json({ data: chunk, nextCursor });
});
/**
 * POST /api/v1/chats/:id/messages
 * body: { role: 'user'|'assistant'|'system', content: string }
 */
chatsRouter.post("/chats/:id/messages", async (req, res) => {
    const { id } = req.params;
    const { role, content } = req.body || {};
    if (!role || !content)
        return res.status(400).json({ error: "role and content required" });
    const msg = await MessageModel_1.Message.create({ conversationId: id, role, content });
    await ConversationModel_1.Conversation.findByIdAndUpdate(id, { $set: { updatedAt: new Date() } });
    res.status(201).json({ id: String(msg._id), createdAt: msg.createdAt });
});
exports.default = chatsRouter;
//# sourceMappingURL=chats.js.map