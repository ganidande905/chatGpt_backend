"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const list_models_1 = require("../controllers/list_models");
const modelRouter = (0, express_1.Router)();
modelRouter.get("/", list_models_1.getModels);
exports.default = modelRouter;
//# sourceMappingURL=model_router.js.map