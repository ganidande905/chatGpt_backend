import { Router } from "express";
import helloRouter from "./hello_router";
import openAiRouter from "./open_ai_router";
import modelRouter from "./model_router";
import chatsRouter from "./chats_router";
const router = Router();

router.use("/hello", helloRouter);
router.use("/generate_response", openAiRouter);
router.use("/models", modelRouter);
router.use("/", chatsRouter);  
export default router;