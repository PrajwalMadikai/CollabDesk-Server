import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./database/connection";
import { errorHandler } from "./presentation/middleware/errorHandler";
import paymentRoute from "./presentation/routes/paymentRoute";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

connectDB();

app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", paymentRoute);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Payment service running on http://localhost:${PORT}`);
});
