import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./database/connection";
import { errorHandler } from "./presentation/middleware/errorHandler";
import adminRoute from "./presentation/routes/adminRoute";
import authRoute from "./presentation/routes/authRoute";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", authRoute);
app.use("/admin", adminRoute);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Auth service running on http://localhost:${PORT}`);
});
