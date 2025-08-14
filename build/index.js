"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
// index.ts
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes/routes"));
const mongoose_1 = require("./db/mongoose");
dotenv_1.default.config();
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use((req, res, next) => {
    if (!process.env.APP_KEY)
        return next();
    if (req.headers["x-app-key"] !== process.env.APP_KEY) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
});
const uri = process.env.MONGODB_URI;
if (!uri)
    throw new Error("MONGODB_URI missing");
(async () => {
    await (0, mongoose_1.connectMongo)(uri);
})();
exports.app.use("/api/v1", routes_1.default);
if (!process.env.VERCEL) {
    const PORT = Number(process.env.PORT) || 3000;
    exports.app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
//# sourceMappingURL=index.js.map