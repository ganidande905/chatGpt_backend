"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hello_router_1 = __importDefault(require("./hello_router"));
const open_ai_router_1 = __importDefault(require("./open_ai_router"));
const model_router_1 = __importDefault(require("./model_router"));
const chats_router_1 = __importDefault(require("./chats_router"));
const router = (0, express_1.Router)();
router.use("/hello", hello_router_1.default);
router.use("/generate_response", open_ai_router_1.default);
router.use("/models", model_router_1.default);
router.use("/", chats_router_1.default);
exports.default = router;
//# sourceMappingURL=routes.js.map