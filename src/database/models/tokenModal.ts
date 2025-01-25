import mongoose, { Schema } from "mongoose";

const TokenSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  fullname: { type: String, required: true },
  workSpaces: { type: Array, default: [] },
  paymentDetail: {
    paymentType: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export const TokenModal = mongoose.model("Token", TokenSchema);
