
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import router from "./routes/routes";
import { connectMongo } from "./db/mongoose";

dotenv.config();

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req,res,next)=>{
  if (!process.env.APP_KEY) return next();
  if (req.headers["x-app-key"] !== process.env.APP_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});
const uri = process.env.MONGODB_URI!;
if (!uri) throw new Error("MONGODB_URI missing");
(async () => {
  await connectMongo(uri);
})();

app.use("/api/v1", router);

const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});