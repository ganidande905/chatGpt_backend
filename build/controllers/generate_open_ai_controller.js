"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOpenAiResponsesController = void 0;
const openAiClient_1 = require("../utils/openAiClient");
const ConversationModel_1 = require("../db/models/ConversationModel");
const MessageModel_1 = require("../db//models/MessageModel");
// This was straight given to me by openai playground, 
//----------------------------------------------------------
const generateOpenAiResponsesController = async (req, res) => {
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
        const stream = await openAiClient_1.openai.chat.completions.create({
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
            const docs = [];
            if (typeof userText === "string" && userText.trim()) {
                docs.push({ conversationId, role: "user", content: userText.trim(), createdAt: now });
            }
            if (typeof assistant === "string" && assistant.trim()) {
                docs.push({ conversationId, role: "assistant", content: assistant.trim(), createdAt: now });
            }
            if (docs.length) {
                await MessageModel_1.Message.insertMany(docs); // <<< REQUIRED CHANGE: only insert when non-empty
                await ConversationModel_1.Conversation.findByIdAndUpdate(conversationId, {
                    $set: { updatedAt: now, ...(model ? { model } : {}) },
                });
            }
        }
    }
    catch (error) {
        console.error(error);
        try {
            res.write(`event: error\ndata: ${JSON.stringify({ message: error?.message || "stream error" })}\n\n`);
            res.end();
        }
        catch { }
    }
};
exports.generateOpenAiResponsesController = generateOpenAiResponsesController;
//# sourceMappingURL=generate_open_ai_controller.js.map