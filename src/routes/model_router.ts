import {Router, Request, Response} from "express";
import { getModels } from "../controllers/list_models";

const modelRouter = Router()

modelRouter.get("/", getModels);

export default modelRouter;