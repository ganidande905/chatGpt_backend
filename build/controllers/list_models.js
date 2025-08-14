"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModels = void 0;
//Thnks to this openai documentation from https://platform.openai.com/docs/api-reference/models/list?lang=node.js , actually helped
const express_1 = __importDefault(require("express"));
const openAiClient_1 = require("../utils/openAiClient");
const router = express_1.default.Router();
const getModels = async (req, res) => {
    try {
        const list = await openAiClient_1.openai.models.list();
        const models = [];
        for await (const model of list) {
            if (model.id.startsWith("gpt")) {
                models.push({ id: model.id });
            }
        }
        res.json(models);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ data: error });
    }
};
exports.getModels = getModels;
//# sourceMappingURL=list_models.js.map