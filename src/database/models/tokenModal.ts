import mongoose, { Schema } from "mongoose";

const TokenSchema = new Schema({
  email: { type: String, required: true },  
  password: { type: String, required: true },  
  fullname: { type: String, required: true },  
  workSpaces: { 
    type: [{
      workspaceId: String,
      workspaceName: String
    }], 
    default: [] 
  },
  paymentDetail: {
    paymentType: { type: String, default: 'Non' },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: Date.now },
  },
  isAdmin:{
    type:Boolean,
    default:false
  },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});
export const TokenModal = mongoose.model("Token", TokenSchema);
