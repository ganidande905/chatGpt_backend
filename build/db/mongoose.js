"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongo = connectMongo;
//inspired from chatGpt? oh well my db was not being connected and the backend was starting, so this was some kind of failproof
const mongoose_1 = __importDefault(require("mongoose"));
async function connectMongo(uri) {
    mongoose_1.default.set("strictQuery", true);
    mongoose_1.default.set("bufferTimeoutMS", 5000);
    mongoose_1.default.connection.on("connected", () => console.log("[mongo] connected"));
    mongoose_1.default.connection.on("error", (e) => console.error("[mongo] error", e.message));
    mongoose_1.default.connection.on("disconnected", () => console.warn("[mongo] disconnected"));
    await mongoose_1.default.connect(uri, { dbName: "mychatdb",
    });
}
//# sourceMappingURL=mongoose.js.map