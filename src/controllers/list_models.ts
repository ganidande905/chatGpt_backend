//Thnks to this openai documentation from https://platform.openai.com/docs/api-reference/models/list?lang=node.js , actually helped
import express from "express";
import { openai } from "../utils/openAiClient";
import { Request, Response } from 'express';
const router = express.Router();

export const getModels = async (req: Request, res: Response) => {
  try {
    const list = await openai.models.list();

    const models = [];
    for await (const model of list) {
      if (model.id.startsWith("gpt")) {
        models.push({ id: model.id });
      }
    }

    res.json(models);
  } catch (error) {
    console.log(error)
    res.status(500).json({data:error})
  }
};

