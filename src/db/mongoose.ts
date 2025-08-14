//inspired from chatGpt? oh well my db was not being connected and the backend was starting, so this was some kind of failproof
import mongoose from "mongoose";

export async function connectMongo(uri: string) {
  mongoose.set("strictQuery", true);
  mongoose.set("bufferTimeoutMS", 5000);
  mongoose.connection.on("connected", () => console.log("[mongo] connected"));
  mongoose.connection.on("error", (e) => console.error("[mongo] error", e.message));
  mongoose.connection.on("disconnected", () => console.warn("[mongo] disconnected"));

  await mongoose.connect(uri, {dbName: "mychatdb",
  } as any);
}

