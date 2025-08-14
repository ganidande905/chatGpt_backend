import { Request, Response } from 'express';
import { openai } from '../utils/openAiClient';
import {Conversation} from "../db/models/ConversationModel";
import {Message} from "../db//models/MessageModel";

// This was straight given to me by openai playground, 
//----------------------------------------------------------
export const generateOpenAiResponsesController = async (req: Request, res: Response) => {
  try {
    const { messages, model, conversationId, userText } = req.body ?? {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array required" });
    }
    const DEFAULT_MODEL = "gpt-3.5-turbo"; 
    const chosenModel = typeof model === "string" && model.length > 0 ? model : DEFAULT_MODEL;

    res.set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    });

    const stream = await openai.chat.completions.create({
      model: chosenModel,
      messages,
      stream: true,
      temperature: 1,
      max_tokens: 2048,    
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
//-------------------------------------------------------------

// this is the part where we stream the response, like in get the one one word at a time    
// thanks to the last code snippet in this man's medium blog: https://medium.com/@adamkudzin/streaming-chatgpt-with-express-js-d6ea96b08514 
    let assistant = "";
    for await (const chunk of stream) {
      const data = chunk.choices[0]?.delta?.content || "";
      if (data) {
        assistant += data; // <<< REQUIRED CHANGE: accumulate assistant text
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();

// this is the part where we save the conversation and messages to the database
    if (conversationId && (userText || assistant)) {
      const now = new Date();

      const docs: any[] = [];
      if (typeof userText === "string" && userText.trim()) {
        docs.push({ conversationId, role: "user", content: userText.trim(), createdAt: now });
      }
      if (typeof assistant === "string" && assistant.trim()) {
        docs.push({ conversationId, role: "assistant", content: assistant.trim(), createdAt: now });
      }

      if (docs.length) {
        await Message.insertMany(docs); // <<< REQUIRED CHANGE: only insert when non-empty
        await Conversation.findByIdAndUpdate(conversationId, {
          $set: { updatedAt: now, ...(model ? { model } : {}) },
        });
      }
    }
  } catch (error) {
    console.error(error);
    try {
      res.write(`event: error\ndata: ${JSON.stringify({ message: (error as any)?.message || "stream error" })}\n\n`);
      res.end();
    } catch {}
  }
};