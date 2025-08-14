import {Router} from "express";
import {Conversation} from "../db/models/ConversationModel";
import {Message} from "../db/models/MessageModel";

const chatsRouter = Router();

chatsRouter.post("/chats", async (req, res) => {
    const{ userId, title, model} = req.body || {};
    if (!userId || !model) return res.status(400).json({error: "userId and model are required"});

    const convo = await Conversation.create({
    userId,
    title: title ?? "New Chat",
    model
    });
    res.json({
        id:String(convo._id),
        title: convo.title,
        model: convo.model,
        createdAt: convo.createdAt,
        updatedAt: convo.updatedAt
    });
});

chatsRouter.get("/chats", async (req, res) => {
    const {userId} = req.query as any;
    if (!userId) return res.status(400).json({error: "userId is required"});

    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const cursor = req.query.cursor as string | undefined;

    const crit: any = {userId};
    if (cursor) crit.updatedAt = { $lt: new Date(cursor) };

    const rows = await Conversation.find(crit).sort({ updatedAt: -1 }).limit(limit+1).lean();
    const hasMore= rows.length > limit;
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
    const cursor = req.query.cursor as string | undefined; 
    const crit: any = { conversationId: id };
    if (cursor) crit._id = { $lt: cursor };
  
    const rows = await Message.find(crit).sort({ _id: -1 }).limit(limit + 1).lean();
    const hasMore = rows.length > limit;
    const chunk = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor = hasMore ? String(chunk[chunk.length - 1]._id) : null;
  
    chunk.reverse(); // oldest first for UI
    res.json({ data: chunk, nextCursor });
  });
  
chatsRouter.post("/chats/:id/messages", async (req, res) => {
    const { id } = req.params;
    let { role, content } = req.body || {};
    if (!role) return res.status(400).json({ error: "role required" });
  
    content = (content ?? "").toString().trim();
    if (!content) {
      // this line blocks empty messages, 
      return res.status(400).json({ error: "content required (non-empty)" });
    }
  
    const msg = await Message.create({ conversationId: id, role, content });
    await Conversation.findByIdAndUpdate(id, { $set: { updatedAt: new Date() } });
    res.status(201).json({ id: String(msg._id), createdAt: msg.createdAt });
  });
  
  export default chatsRouter;